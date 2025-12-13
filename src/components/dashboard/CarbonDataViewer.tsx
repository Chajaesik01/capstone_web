import { getCarbonDB } from '@/api/dashboard/api';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LineChart from './chart/LineChart';

type CarbonDataViewerProps = {
  LineSetSelectedYear: (year: string) => void;
  LineSelectedYear: string;
}

export const CarbonDataViewer = ({LineSetSelectedYear, LineSelectedYear} : CarbonDataViewerProps) => {
  const [carbonData, setCarbonData] = useState<Record<string, any> | null>(null);
  const [selectedBunji, setSelectedBunji] = useState("");
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
          //const latestYear = years[0]; // 가장 큰 연도 (최근 연도)
          const latestYear = '2025';
          LineSetSelectedYear(latestYear);
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
    if (carbonData && selectedBunji && LineSelectedYear) {
      const yearData = carbonData[selectedBunji]?.[LineSelectedYear] || {};
      setMonthlyData(yearData);
    }
  }, [carbonData, selectedBunji, LineSelectedYear]);

  if (!carbonData) return <div>로딩 중...</div>;

  return (
    <div>
      <S.ViewerWrapper>
      <h2>탄소 배출량(년도)</h2>
      {/* 연도 선택 */}
      <select 
        value={LineSelectedYear} 
        onChange={(e) => LineSetSelectedYear(e.target.value)}
      >
        {carbonData[selectedBunji] && Object.keys(carbonData[selectedBunji]).map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
        <LineChart carbonData={carbonData} LineSelectedYear={LineSelectedYear}/>
      </select>
      </S.ViewerWrapper>
    </div>
  );
};

const S = {
  ViewerWrapper: styled.div`
    display: flex;
    flex-direction: row;
    gap: 1%;
  `
}