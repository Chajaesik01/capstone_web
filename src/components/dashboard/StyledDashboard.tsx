import { colors } from '@/styles';

import styled from 'styled-components';
import firstImg from '@/assets/dashboard/1.svg';
import secondImg from '@/assets/dashboard/2.svg';
import thirdImg from '@/assets/dashboard/3.svg';
import fourthImg from '@/assets/dashboard/4.svg';
import fifthImg from '@/assets/dashboard/5.svg';
import home from '@/assets/dashboard/home.svg';
import co2 from '@/assets/dashboard/co2.svg';
import calendar from '@/assets/dashboard/calendar.svg';
import BarLineChart from './chart/BarLineChart';
import CircleChart from './chart/CircleChart';
import LineChart from './chart/LineChart';
import type { CarbonAnalysisResult } from '@/types/types';
import { useState } from 'react';

type StyledDashboardProps = {
  carbonData: any; // 실제 type으로 변경 필요
  analyzeCarbonData: CarbonAnalysisResult | undefined;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
}


const StyledDashboard = ({ carbonData, analyzeCarbonData, setSelectedYear, setSelectedMonth }:StyledDashboardProps) => {

  
  const [selectedYear, setSelectedYedr] = useState('2024');
  const locationKey = "0536_0009";
  const yearKey = "2024";
  const cData = carbonData?.[locationKey]?.[yearKey];
  const aData = analyzeCarbonData?.[locationKey]?.analysis;
  console.log('carbonData : ', carbonData)
  console.log('analyzeCarbonData : ',analyzeCarbonData)
  
  return (
    <S.DashboardWrapper>
      <S.DashboardHeader>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={firstImg} alt="firstImg" />
              연간 총 전기 사용량
              <br />
              {selectedYear}
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>{Math.floor(aData?.totalElectricity ?? 0).toLocaleString()}Wh</S.HeaderItemNumber>
        </S.DashboardHeaderItem>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={secondImg} alt="secondImg" />
              월 평균 전기 사용량
              <br />
              Utillization
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>{Math.floor(aData?.avgElectricity ?? 0).toLocaleString()}Wh</S.HeaderItemNumber>
        </S.DashboardHeaderItem>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={thirdImg} alt="thirdImg" />
              연간 총 탄소 배출량
              <br />
              {selectedYear}
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>{Math.floor(aData?.totalCarbon ?? 0).toLocaleString()}</S.HeaderItemNumber>
        </S.DashboardHeaderItem>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={fourthImg} alt="fourthImg" />
              월 평균 탄소 배출량
              <br />
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>
            <S.Row>
              <p>{Math.floor(aData?.avgCarbon ?? 0).toLocaleString()}</p>
              <span>
                metric tons
                <br />
                CO2/year
              </span>
            </S.Row>
          </S.HeaderItemNumber>
        </S.DashboardHeaderItem>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={fifthImg} alt="fifthImg" />
              {selectedYear} 최대 월별 
              <br />
              탄소 배출량
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>
            <S.Row>
              <p>{Math.floor(aData?.maxCarbon ?? 0).toLocaleString()}</p>
              <span>
                metric tons
                <br />
                CO2/year
              </span>
            </S.Row>
          </S.HeaderItemNumber>
        </S.DashboardHeaderItem>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={secondImg} alt="secondImg" />
              {selectedYear} 최소 월별
              <br />
              탄소 배출량
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>{Math.floor(aData?.minCarbon ?? 0).toLocaleString()}</S.HeaderItemNumber>
        </S.DashboardHeaderItem>
      </S.DashboardHeader>
      <S.DashboardMiddle>
        <S.MiddleTitle>
          <div style={{ display: 'flex', gap: '0.7vw' }}>
            <img src={home} alt="home" />
            Energy Usage
          </div>
          <div style={{ display: 'flex', gap: '0.7vw' }}>
            <img src={calendar} alt="calendar" />
            Daily Energy Cost
          </div>
        </S.MiddleTitle>
        <S.Row>
          <BarLineChart />
          <CircleChart />
        </S.Row>
      </S.DashboardMiddle>
      <S.DashboardBottom>
        <S.BottomTitle>
          <img src={co2} alt="co2" />
          Carbon Footprint CO2
        </S.BottomTitle>
        <LineChart />
      </S.DashboardBottom>
    </S.DashboardWrapper>
  );
};
export default StyledDashboard;

const S = {
  DashboardWrapper: styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3vh;
  `,
  DashboardHeader: styled.div`
    display: flex;
    width: 100%;
    height: 20vh;
    flex-direction: row;
    padding: 0px 10px;
    gap: 1vw;
  `,

  DashboardHeaderItem: styled.div`
    width: 19%;
    height: 100%;
    gap: 1vh;
  `,
  HeaderItemTitle: styled.div`
    display: flex;
    width: 100%;
    height: 45%;
    background-color: ${colors.semantic.secondary};
    color: #fff;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    border-radius: 8px;
  `,

  HeaderItemNumber: styled.div`
    display: flex;
    width: 100%;
    height: 45%;
    background-color: #fff;
    justify-content: center;
    align-items: center;
    color: ${colors.semantic.text};
    font-size: 24px;
    border-radius: 8px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
    font-weight: 400;

    span {
      font-size: 15px;
    }
  `,
  Row: styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.7vw;
  `,

  DashboardMiddle: styled.div`
    width: 100%;
    height: 40vh;
    padding: 0px 10px;
    margin-bottom: 7vh;
  `,

  MiddleTitle: styled.div`
    display: flex;
    justify-content: space-between;
    width: 90%;
    font-size: 23px;
    font-weight: 700px;
  `,
  DashboardBottom: styled.div`
    width: 100%;
    height: 25vh;
    padding: 0px 10px;
  `,
  BottomTitle: styled.div`
    display: flex;
    justify-content: start;
    width: 90%;
    font-size: 23px;
    font-weight: 700px;
    gap: 0.7vw;
  `,
};
