import { getCarbonDB } from '@/api/dashboard/api';
import React, { useState, useEffect } from 'react';

export const CarbonDataViewer = () => {
  const [carbonData, setCarbonData] = useState(null);
  const [selectedBunji, setSelectedBunji] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [monthlyData, setMonthlyData] = useState({});

  const address = '서울특별시_강남구_신사동';
  useEffect(() => {
    const fetchData = async () => {
      const data = await getCarbonDB(address);
      if (data) {
        setCarbonData(data);
        
        // 첫 번째 부지를 기본 선택
        const firstBunji = Object.keys(data)[0];
        setSelectedBunji(firstBunji);
        
        // 첫 번째 연도를 기본 선택
        if (data[firstBunji]) {
          const years = Object.keys(data[firstBunji]).sort((a, b) => parseInt(b) - parseInt(a));
          const latestYear = years[0]; // 가장 큰 연도 (최근 연도)
          setSelectedYear(latestYear);
          setMonthlyData(data[firstBunji][latestYear] || {});
        }
      }
    };
    
    if (address) {
      fetchData();
    }
  }, [address]);

  // 부지나 연도 변경 시 월별 데이터 업데이트
  useEffect(() => {
    if (carbonData && selectedBunji && selectedYear) {
      const yearData = carbonData[selectedBunji]?.[selectedYear] || {};
      setMonthlyData(yearData);
    }
  }, [carbonData, selectedBunji, selectedYear]);

  if (!carbonData) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>탄소 배출 데이터</h2>
      
      {/* 부지 선택 */}
      <select 
        value={selectedBunji} 
        onChange={(e) => setSelectedBunji(e.target.value)}
      >
        {Object.keys(carbonData).map(bunji => (
          <option key={bunji} value={bunji}>{bunji}</option>
        ))}
      </select>
      
      {/* 연도 선택 */}
      <select 
        value={selectedYear} 
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {carbonData[selectedBunji] && Object.keys(carbonData[selectedBunji]).map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      
      {/* 월별 데이터 표시 */}
      <div>
        <h3>{selectedYear}년 월별 데이터</h3>
        {Object.entries(monthlyData).map(([month, data]) => (
          <div key={month} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
            <h4>{month}월</h4>
            <p>탄소 배출량: {data.carbon_emission_kgCO2eq} kgCO2eq</p>
            <p>전력 사용량: {data.electricity_usage_kwh} kWh</p>
            <p>주소: {data.retrieved_full_address}</p>
            <p>도로명 주소: {data.road_address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};