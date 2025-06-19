/* eslint-disable react-hooks/exhaustive-deps */

import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useEffect, useRef } from 'react';

const postcodeScriptUrl =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

type DaumPostcodeData = {
  address: string;
  addressType: string;
  sido: string;
  sigungu: string;
  bname: string;
  buildingName: string;
};

export interface AddressObj {
  areaAddress: string;
  townAddress: string;
}

type DaumPostProps = {
  setAddressObj: (obj: AddressObj) => void;
  trigger: any;
};

function DaumPost(props: DaumPostProps) {
  // 클릭 시 수행될 팝업 생성 함수
  const open = useDaumPostcodePopup(postcodeScriptUrl);
  const hasOpened = useRef(false); // 실행 여부를 추적

  const handleComplete = (data: DaumPostcodeData) => {
    let fullAddress = data.address;
    let extraAddress = ''; // 추가될 주소
    const localAddress = data.sido + ' ' + data.sigungu; // 지역주소(시, 도 + 시, 군, 구)

    if (data.addressType === 'R') {
      // 주소타입이 도로명주소일 경우
      if (data.bname !== '') {
        extraAddress += data.bname; // 법정동, 법정리
      }
      if (data.buildingName !== '') {
        // 건물명
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      // 지역주소 제외 전체주소 치환
      fullAddress = fullAddress.replace(localAddress, '');
      // 조건 판단 완료 후 지역 주소 및 상세주소 state 수정
      props.setAddressObj({
        areaAddress: localAddress,
        townAddress: (fullAddress +=
          extraAddress !== '' ? `(${extraAddress})` : ''),
      });
      // 주소 검색이 완료된 후 결과를 매개변수로 전달
      // 다음에 수행할 작업을 명시
    }
  };

  useEffect(() => {
    if (!hasOpened.current) {
      hasOpened.current = true;
      open({ onComplete: handleComplete });
    }
  }, []);

  return null;
}

export default DaumPost;
