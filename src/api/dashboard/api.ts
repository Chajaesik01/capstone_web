
import { database } from '@/firebase-config';
import { get, ref, } from 'firebase/database';


export const getCarbonDB = async (address: string) => {
  const carbonRef = ref(database, `carbon_data/${address}`);
  const snapshot = await get(carbonRef);

  if (snapshot.exists()) {
    const userData = snapshot.val();
    return userData;
  }
};


export const getAnalyzeCarbonData = async (address: string, year: string, month?: string) => {
  const carbonData = await getCarbonDB(address);
  
  if (!carbonData) return null;
  
  const analysis: { [key: string]: any } = {};
  
  // 각 부지별 분석
  Object.entries(carbonData as Record<string, any>).forEach(([bunji, bunjiData]) => {
    if (bunjiData[year]) {
      if (month) {
        // 특정 월 데이터 분석
        const monthData = bunjiData[year][month];
        if (monthData && 
            typeof monthData === 'object' && 
            'carbon_emission_kgCO2eq' in monthData && 
            'electricity_usage_kwh' in monthData) {
          analysis[bunji] = {
            year,
            month,
            carbon_emission: monthData.carbon_emission_kgCO2eq,
            electricity_usage: monthData.electricity_usage_kwh,
            // 단일 월 데이터이므로 분석 정보는 동일
            analysis: {
              totalCarbon: monthData.carbon_emission_kgCO2eq,
              totalElectricity: monthData.electricity_usage_kwh,
              avgCarbon: monthData.carbon_emission_kgCO2eq,
              avgElectricity: monthData.electricity_usage_kwh,
              maxCarbon: monthData.carbon_emission_kgCO2eq,
              minCarbon: monthData.carbon_emission_kgCO2eq,
              monthCount: 1
            }
          };
        }
      } else {
        // 전체 년도 데이터 분석 (월별 요약)
        const yearData = bunjiData[year];
        const monthlyValues = Object.values(yearData as Record<string, any>);
        
        // 타입 체크 추가
        const validMonthlyValues = monthlyValues.filter(month => 
          month && 
          typeof month === 'object' && 
          'carbon_emission_kgCO2eq' in month && 
          'electricity_usage_kwh' in month
        );
        
        if (validMonthlyValues.length === 0) {
          console.warn(`No valid data for ${bunji} - ${year}`);
          return;
        }
        
        // 연간 총합 계산
        const totalCarbon = validMonthlyValues.reduce((sum, month: any) => 
          sum + (month.carbon_emission_kgCO2eq || 0), 0
        );
        
        const totalElectricity = validMonthlyValues.reduce((sum, month: any) => 
          sum + (month.electricity_usage_kwh || 0), 0
        );
        
        // 월평균 계산
        const avgCarbon = totalCarbon / validMonthlyValues.length;
        const avgElectricity = totalElectricity / validMonthlyValues.length;
        
        // 최대/최소값 찾기
        const carbonValues = validMonthlyValues.map((m: any) => m.carbon_emission_kgCO2eq || 0);
        const electricityValues = validMonthlyValues.map((m: any) => m.electricity_usage_kwh || 0);
        const maxCarbon = Math.max(...carbonValues);
        const minCarbon = Math.min(...carbonValues);
        const maxElectricity = Math.max(...electricityValues);
        const minElectricity = Math.min(...electricityValues);
        
        // 월별 데이터 구성
        const monthlyData: { [key: string]: any } = {};
        Object.entries(yearData as Record<string, any>).forEach(([monthKey, monthValue]) => {
          if (monthValue && 
              typeof monthValue === 'object' && 
              'carbon_emission_kgCO2eq' in monthValue && 
              'electricity_usage_kwh' in monthValue) {
            monthlyData[monthKey] = {
              carbon_emission: monthValue.carbon_emission_kgCO2eq,
              electricity_usage: monthValue.electricity_usage_kwh
            };
          }
        });
        
        analysis[bunji] = {
          year,
          monthlyData,
          analysis: {
            totalCarbon,
            totalElectricity,
            avgCarbon,
            avgElectricity,
            maxCarbon,
            minCarbon,
            maxElectricity,
            minElectricity,
            monthCount: validMonthlyValues.length
          }
        };
      }
    }
  });
  
  return Object.keys(analysis).length > 0 ? analysis : null;
};

// 가장 최근 데이터 가져오기 함수
export const getLatestCarbonData = async (address: string) => {
  const carbonData = await getCarbonDB(address);
  
  if (!carbonData) return null;
  
  let latestYear = '';
  let latestMonth = '';
  let latestData: any = null;
  
  // 모든 부지에서 가장 최근 데이터 찾기
  Object.entries(carbonData as Record<string, any>).forEach(([bunji, bunjiData]) => {
    Object.entries(bunjiData as Record<string, any>).forEach(([year, yearData]) => {
      Object.entries(yearData as Record<string, any>).forEach(([month, monthData]) => {
        if (monthData && 
            typeof monthData === 'object' && 
            'carbon_emission_kgCO2eq' in monthData && 
            'electricity_usage_kwh' in monthData) {
          
          const currentDate = `${year}-${month.padStart(2, '0')}`;
          const latestDate = latestYear && latestMonth ? `${latestYear}-${latestMonth.padStart(2, '0')}` : '';
          
          if (!latestDate || currentDate > latestDate) {
            latestYear = year;
            latestMonth = month;
            latestData = {
              bunji,
              year,
              month,
              data: monthData
            };
          }
        }
      });
    });
  });
  
  return latestData;
};

// 특정 년도/월 데이터 가져오기 함수
export const getCarbonDataByDate = async (address: string, year: string, month?: string) => {
  const carbonData = await getCarbonDB(address);
  
  if (!carbonData) return null;
  
  const result: { [key: string]: any } = {};
  
  // 각 부지별로 해당 년도/월 데이터 수집
  Object.entries(carbonData as Record<string, any>).forEach(([bunji, bunjiData]) => {
    if (bunjiData[year]) {
      if (month) {
        // 특정 월 데이터
        const monthData = bunjiData[year][month];
        if (monthData && 
            typeof monthData === 'object' && 
            'carbon_emission_kgCO2eq' in monthData && 
            'electricity_usage_kwh' in monthData) {
          result[bunji] = {
            year,
            month,
            carbon_emission: monthData.carbon_emission_kgCO2eq,
            electricity_usage: monthData.electricity_usage_kwh
          };
        }
      } else {
        // 전체 년도 데이터 (월별 요약)
        const yearData = bunjiData[year];
        const monthlyData: { [key: string]: any } = {};
        
        Object.entries(yearData as Record<string, any>).forEach(([monthKey, monthValue]) => {
          if (monthValue && 
              typeof monthValue === 'object' && 
              'carbon_emission_kgCO2eq' in monthValue && 
              'electricity_usage_kwh' in monthValue) {
            monthlyData[monthKey] = {
              carbon_emission: monthValue.carbon_emission_kgCO2eq,
              electricity_usage: monthValue.electricity_usage_kwh
            };
          }
        });
        
        if (Object.keys(monthlyData).length > 0) {
          result[bunji] = {
            year,
            monthlyData
          };
        }
      }
    }
  });
  
  return Object.keys(result).length > 0 ? result : null;
};

// 사용 가능한 년도/월 목록 가져오기 함수
export const getAvailableDates = async (address: string) => {
  const carbonData = await getCarbonDB(address);
  
  if (!carbonData) return null;
  
  const availableDates: { [year: string]: string[] } = {};
  
  Object.entries(carbonData as Record<string, any>).forEach(([bunji, bunjiData]) => {
    Object.entries(bunjiData as Record<string, any>).forEach(([year, yearData]) => {
      if (!availableDates[year]) {
        availableDates[year] = [];
      }
      
      Object.keys(yearData as Record<string, any>).forEach((month) => {
        if (!availableDates[year].includes(month)) {
          availableDates[year].push(month);
        }
      });
    });
  });
  
  // 월을 숫자 순서로 정렬
  Object.keys(availableDates).forEach(year => {
    availableDates[year] = availableDates[year].sort((a, b) => parseInt(a) - parseInt(b));
  });
  
  return availableDates;
};