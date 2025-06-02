from flask import Flask, request, jsonify
import requests
import json
import ssl
from requests.adapters import HTTPAdapter
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

SERVICE_ACCOUNT_KEY_FILENAME = "capstone-design-d99e4-firebase-adminsdk-fbsvc-45abdd5fb5.json"
FIREBASE_DATABASE_URL = "https://capstone-design-d99e4-default-rtdb.asia-southeast1.firebasedatabase.app/"

try:
    if not firebase_admin._apps:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        key_path = os.path.join(base_dir, SERVICE_ACCOUNT_KEY_FILENAME)
        if not os.path.exists(key_path):
            print(f"경고: 서비스 계정 키 파일 '{key_path}'를 찾을 수 없습니다. Firebase 초기화가 실패할 수 있습니다.")
            raise FileNotFoundError(f"서비스 계정 키 파일을 찾을 수 없습니다: {key_path}")
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred, {
            'databaseURL': FIREBASE_DATABASE_URL
        })
        # print("Firebase Admin SDK가 성공적으로 초기화되었습니다.")
    # else:
        # print("Firebase Admin SDK가 이미 초기화되어 있습니다.")
except Exception as e:
    # print(f"Firebase Admin SDK 초기화 중 치명적인 오류 발생: {e}")
    app.logger.critical(f"Firebase Admin SDK 초기화 중 치명적인 오류 발생: {e}")
    raise

ADMIN_CODE_API_SERVICE_KEY = os.environ.get("ADMIN_CODE_API_KEY")
ENERGY_API_SERVICE_KEY = os.environ.get("ENERGY_API_KEY")
KAKAO_LOCAL_API_REST_KEY = os.environ.get("KAKAO_LOCAL_API_KEY")

ADMIN_CODE_API_URL = "http://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList"
ENERGY_API_URL = "https://apis.data.go.kr/1613000/BldEngyHubService/getBeElctyUsgInfo"
KAKAO_GEOCODE_API_URL = "https://dapi.kakao.com/v2/local/search/address.json"

ELECTRICITY_EMISSION_FACTOR = 7821.86 / 16374

if not all([ADMIN_CODE_API_SERVICE_KEY, ENERGY_API_SERVICE_KEY, KAKAO_LOCAL_API_REST_KEY]):
    app.logger.warning("하나 이상의 API 키가 .env 파일 또는 환경 변수에 설정되지 않았습니다.")
    # raise ValueError("필수 API 키가 설정되지 않았습니다. .env 파일을 확인하세요.")

class CustomTLSAdapter(HTTPAdapter):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def init_poolmanager(self, connections, maxsize, block=False):
        context = ssl.create_default_context()
        context.minimum_version = ssl.TLSVersion.TLSv1_2
        context.maximum_version = ssl.TLSVersion.TLSv1_2
        try:
            context.set_ciphers('ALL:@SECLEVEL=0') # 보안 주의: 테스트 후 조정 필요
            # app.logger.info("CustomTLSAdapter: Cipher suite set to 'ALL:@SECLEVEL=0'")
        except ssl.SSLError:
            try:    
                context.set_ciphers('DEFAULT:@SECLEVEL=1')
                # app.logger.info("CustomTLSAdapter: Cipher suite set to 'DEFAULT:@SECLEVEL=1'")
            except ssl.SSLError:
                # app.logger.warning("CustomTLSAdapter: Failed to set ciphers, using default.")
                pass
        self.poolmanager = requests.packages.urllib3.poolmanager.PoolManager(
            num_pools=connections,
            maxsize=maxsize,
            block=block,
            ssl_context=context
        )

def get_admin_codes(full_address_name):
    params = {
        'ServiceKey': ADMIN_CODE_API_SERVICE_KEY,
        'type': 'json',
        'pageNo': '1',
        'numOfRows': '10',
        'flag': 'Y',
        'locatadd_nm': full_address_name
    }
    response = None
    try:
        response = requests.get(ADMIN_CODE_API_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        items = []
        if data.get('StanReginCd') and isinstance(data['StanReginCd'], list) and len(data['StanReginCd']) > 0:
            if 'row' in data['StanReginCd'][0]:
                 items = data['StanReginCd'][0]['row']
            elif len(data['StanReginCd']) > 1 and 'row' in data['StanReginCd'][1]:
                 items = data['StanReginCd'][1]['row']
        if not items and data.get('response') and data['response'].get('body') and data['response']['body'].get('items'):
            raw_items = data['response']['body']['items']
            if isinstance(raw_items, dict) and raw_items.get('item'):
                items = raw_items['item']
            elif isinstance(raw_items, list):
                items = raw_items
        if not items:
            app.logger.error(f"Admin code API: No 'item' or 'row' found. Parsed data: {data}")
            return None
        codes_list = []
        for item in items:
            sido_cd = item.get('sido_cd')
            sgg_cd = item.get('sgg_cd')
            umd_cd = item.get('umd_cd')
            ri_cd = item.get('ri_cd')
            locatadd_nm = item.get('locatadd_nm')
            if sido_cd and sgg_cd and umd_cd and ri_cd:
                sigungu_code_for_energy_api = sido_cd + sgg_cd
                beopjeongdong_code_for_energy_api = umd_cd + ri_cd
                codes_list.append({
                    'full_address': locatadd_nm,
                    'sigungu_code': sigungu_code_for_energy_api,
                    'beopjeongdong_code': beopjeongdong_code_for_energy_api
                })
        return codes_list
    except Exception as e:
        app.logger.error(f"Admin code API error: {e}")
        if response is not None:
            app.logger.error(f"Error response text from Admin code API: {response.text[:500]}")
        raise

def get_electricity_usage_custom_tls(sigungu_code, beopjeongdong_code, bun, ji, year_month):
    params = {
        'serviceKey': ENERGY_API_SERVICE_KEY,
        '_type': 'json',
        'sigunguCd': sigungu_code,
        'bjdongCd': beopjeongdong_code,
        'bun': bun,
        'ji': ji,
        'useYm': year_month,
        'numOfRows': '10',
        'pageNo': '1'
    }
    session = requests.Session()
    adapter = CustomTLSAdapter()
    session.mount('https://', adapter)
    response_obj = None
    try:
        response_obj = session.get(ENERGY_API_URL, params=params, timeout=20)
        response_obj.raise_for_status()
        data = response_obj.json()
        items = []
        if data.get('response') and data['response'].get('body') and data['response']['body'].get('items'):
            raw_items = data['response']['body']['items']
            if isinstance(raw_items, dict) and raw_items.get('item'):
                items = raw_items['item'] if isinstance(raw_items['item'], list) else [raw_items['item']]
            elif isinstance(raw_items, list): 
                 items = raw_items
        if not items:
            app.logger.error(f"Building energy API: No 'item' found. Parsed data: {data}")
            return None
        usage_data = []
        for item in items:
            usage_data.append({
                'address': item.get('platPlc', 'N/A'),
                'road_address': item.get('newPlatPlc', 'N/A'),
                'usage_period': item.get('useYm', 'N/A'),
                'electricity_usage_kwh': item.get('useQty', '0')
            })
        return usage_data
    except Exception as e:
        app.logger.error(f"Building energy API error: {e}")
        if response_obj is not None:
            app.logger.error(f"Error response text from Building energy API: {response_obj.text[:500]}")
        raise
    finally:
        session.close()

def geocode_address_kakao(address_string):
    if KAKAO_LOCAL_API_REST_KEY == "여기에_카카오_REST_API_키_입력" or not KAKAO_LOCAL_API_REST_KEY:
        app.logger.warning("카카오 REST API 키가 설정되지 않았습니다. 지오코딩을 건너뜁니다.")
        return None, None

    headers = {"Authorization": f"KakaoAK {KAKAO_LOCAL_API_REST_KEY}"}
    params = {"query": address_string}
    response = None
    try:
        response = requests.get(KAKAO_GEOCODE_API_URL, headers=headers, params=params, timeout=5)
        response.raise_for_status()
        result = response.json()
        if result.get('documents') and len(result['documents']) > 0:
            document = result['documents'][0]
            longitude = document.get('x') 
            latitude = document.get('y')  
            if latitude and longitude:
                return float(latitude), float(longitude)
            else:
                app.logger.warning(f"지오코딩 결과에 좌표 없음: {address_string}, 응답: {result}")
                return None, None
        else:
            app.logger.warning(f"지오코딩 결과 없음: {address_string}, 응답: {result}")
            return None, None
    except Exception as e:
        app.logger.error(f"카카오 지오코딩 API 오류 ({address_string}): {e}")
        if response is not None:
            app.logger.error(f"카카오 API 오류 시 응답 텍스트: {response.text[:500]}")
        return None, None

@app.route('/calculate_carbon_emission', methods=['GET'])
def calculate_carbon_emission_api():
    address_name = request.args.get('address')
    bun = request.args.get('bun')
    ji = request.args.get('ji')
    year_month = request.args.get('ym')

    if not all([address_name, bun, ji, year_month]):
        return jsonify({"error": "Missing required parameters (address, bun, ji, ym)."}), 400
    if len(bun) != 4 or len(ji) != 4 or len(year_month) != 6:
        return jsonify({"error": "Invalid parameter format (bun: 4 digits, ji: 4 digits, ym: 6 digits YYYYMM)."}), 400
        
    try:
        admin_code_info_list = get_admin_codes(address_name)
        if not admin_code_info_list:
            return jsonify({"error": f"Could not find administrative codes for '{address_name}'."}), 404
        
        admin_code_info = admin_code_info_list[0]
        
        latitude, longitude = geocode_address_kakao(admin_code_info.get('full_address', address_name))

        if latitude is None or longitude is None:
            app.logger.warning(f"'{admin_code_info.get('full_address', address_name)}'에 대한 지오코딩 실패. 좌표 없이 데이터 저장/반환.")

        energy_data_list = get_electricity_usage_custom_tls(
            admin_code_info['sigungu_code'],
            admin_code_info['beopjeongdong_code'],
            bun,
            ji,
            year_month
        )

        if not energy_data_list:
            return jsonify({"error": f"Could not find electricity usage data for the given address/period."}), 404

        results = []
        for data_item in energy_data_list:
            try:
                usage_kwh = float(data_item['electricity_usage_kwh'])
                carbon_emission_kg = usage_kwh * ELECTRICITY_EMISSION_FACTOR
                
                firebase_data_to_save = {
                    "full_address": admin_code_info.get('full_address'),
                    "sigungu_code": admin_code_info.get('sigungu_code'),
                    "beopjeongdong_code": admin_code_info.get('beopjeongdong_code'),
                    "bun": bun,
                    "ji": ji,
                    "usage_period": data_item.get('usage_period'),
                    "electricity_usage_kwh": usage_kwh,
                    "carbon_emission_kgCO2eq": round(carbon_emission_kg, 2),
                    "latitude": latitude,
                    "longitude": longitude,
                    "api_address_info": data_item 
                }
                results.append(firebase_data_to_save)

                try:
                    safe_address_name = address_name.replace(" ", "_").replace(".", "").replace("/", "_")
                    safe_bun = bun.replace(".", "").replace("/", "_")
                    safe_ji = ji.replace(".", "").replace("/", "_")
                    
                    firebase_path = f'carbon_data/{safe_address_name}/{year_month}/{safe_bun}_{safe_ji}'
                    ref = db.reference(firebase_path)
                    ref.set(firebase_data_to_save)
                    app.logger.info(f"Firebase에 데이터 저장 성공: {firebase_path}")
                except Exception as fb_e:
                    app.logger.error(f"Firebase 데이터 저장 중 오류 발생: {fb_e}")

            except ValueError:
                app.logger.error(f"Invalid electricity usage value ('{data_item['electricity_usage_kwh']}') for carbon emission calculation.")
                results.append({
                    "address_info": data_item,
                    "error": f"Invalid electricity usage value ('{data_item['electricity_usage_kwh']}') for carbon emission calculation."
                })
        return jsonify(results)

    except Exception as e:
        app.logger.error(f"API 처리 중 내부 오류 발생: {e}")
        return jsonify({"error": "An internal error occurred while processing the API request.", "details": str(e)}), 500
    
if __name__ == '__main__':
    use_env_keys = os.environ.get("ADMIN_CODE_API_KEY") and \
                   os.environ.get("ENERGY_API_KEY") and \
                   os.environ.get("KAKAO_LOCAL_API_KEY")
                   
    use_script_keys_public_api = not (isinstance(ADMIN_CODE_API_SERVICE_KEY, str) and ADMIN_CODE_API_SERVICE_KEY.startswith("기본_")) and \
                                 not (isinstance(ENERGY_API_SERVICE_KEY, str) and ENERGY_API_SERVICE_KEY.startswith("기본_"))
    use_script_key_kakao = not (isinstance(KAKAO_LOCAL_API_REST_KEY, str) and KAKAO_LOCAL_API_REST_KEY == "여기에_카카오_REST_API_키_입력")


    if use_env_keys or (use_script_keys_public_api and use_script_key_kakao) :
        if use_env_keys:
            print("환경 변수에서 API 키를 사용합니다.")
            if (os.environ.get("ADMIN_CODE_API_KEY","").startswith("기본_") or \
                os.environ.get("ENERGY_API_KEY","").startswith("기본_") or \
                os.environ.get("KAKAO_LOCAL_API_KEY","") == "여기에_카카오_REST_API_키_입력"):
                print("경고: 환경 변수가 기본 플레이스홀더 값으로 설정되어 있을 수 있습니다.")
        else: 
            print("스크립트에 직접 설정된 API 키를 사용합니다.")
        
        print("Flask 서버 시작 시도 중...")
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("API 키가 올바르게 설정되지 않았습니다. Flask 앱이 실행되지 않습니다.")
        print("환경 변수 ADMIN_CODE_API_KEY, ENERGY_API_KEY, KAKAO_LOCAL_API_KEY 를 설정하거나,")
        print("스크립트 내의 기본 키 값을 실제 유효한 키로 교체하십시오.")