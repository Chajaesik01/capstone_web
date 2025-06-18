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
import { CarbonDataViewer } from './CarbonDataViewer';
import { EnergyCarbonDataViewer } from './EnergyCarbonDataViewer';
import { useState } from 'react';

type StyledDashboardProps = {   
  carbonData: any; // 실제 type으로 변경 필요   
  analyzeCarbonData: CarbonAnalysisResult | undefined;   
  selectedYear: string;   
  selectedMonth: string;
  LineSelectedYear: string;
  BarSelectedYear: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>; 
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>; 
  setBarSelectedYear: React.Dispatch<React.SetStateAction<string>>;   
  setLineSelectedYear: React.Dispatch<React.SetStateAction<string>>; 
}

const StyledDashboard = ({ carbonData, analyzeCarbonData, selectedYear, 
  selectedMonth, LineSelectedYear, BarSelectedYear, setSelectedMonth, setBarSelectedYear, setSelectedYear, setLineSelectedYear
 }: StyledDashboardProps) => {
  const locationKey = "0536_0009";
  const aData = analyzeCarbonData?.[locationKey]?.analysis;
  const [selectedBunji, setSelectedBunji] = useState("0536_0009");

  return (
    <S.DashboardWrapper>
      {/* <select 
        value={selectedMonth} 
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
      {Object.keys(carbonData?.carbonData?.[selectedBunji]?.[selectedYear] || {}).map(month => (
        <option key={month} value={month}>{month}</option>
      ))}
      </select> */}

      {/* <select 
        value={selectedYear} 
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {carbonData[selectedBunji] && Object.keys(carbonData[selectedBunji]).map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select> */}
      
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
          <S.HeaderItemNumber>{Math.floor(aData?.totalElectricity ?? 0).toLocaleString()}<span>Wh</span></S.HeaderItemNumber>
        </S.DashboardHeaderItem>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={secondImg} alt="secondImg" />
              월 평균 전기 사용량
              <br />
              {selectedMonth}월
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>{Math.floor(aData?.avgElectricity ?? 0).toLocaleString()}<span>Wh</span></S.HeaderItemNumber>
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
          <S.HeaderItemNumber>{Math.floor(aData?.totalCarbon ?? 0).toLocaleString()}<span>tCO2eq</span></S.HeaderItemNumber>
        </S.DashboardHeaderItem>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={fourthImg} alt="fourthImg" />
              월 평균 탄소 배출량
              <br />
              {selectedMonth}월
            </S.Row>
          </S.HeaderItemTitle>
          {/* <S.HeaderItemNumber>
            <S.Row>
              <p>{Math.floor(aData?.avgCarbon ?? 0).toLocaleString()}</p>
              <span>tCO2eq</span>
              <span>
                metric tons
                <br />
                CO2/year
              </span>
            </S.Row>
          </S.HeaderItemNumber> */}
          <S.HeaderItemNumber>{Math.floor(aData?.avgCarbon ?? 0).toLocaleString()}<span>tCO2eq</span></S.HeaderItemNumber>
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
          {/* <S.HeaderItemNumber>
            <S.Row>
              <p>{Math.floor(aData?.maxCarbon ?? 0).toLocaleString()}</p>
              <span>tCO2eq</span>
              <span>
                metric tons
                <br />
                CO2/year
              </span>
            </S.Row>
          </S.HeaderItemNumber> */}
          <S.HeaderItemNumber>{Math.floor(aData?.maxCarbon ?? 0).toLocaleString()}<span>tCO2eq</span></S.HeaderItemNumber>
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
          <S.HeaderItemNumber>{Math.floor(aData?.minCarbon ?? 0).toLocaleString()}<span>tCO2eq</span></S.HeaderItemNumber>
        </S.DashboardHeaderItem>
      </S.DashboardHeader>

      <S.DashboardMiddle>
        <S.MiddleLeft>
          <S.wRow>
            <div>
              <img src={home} alt="home" />
              <p>에너지 사용</p>
            </div>
            <span><EnergyCarbonDataViewer setBarSelectedYear={setBarSelectedYear} BarSelectedYear={BarSelectedYear}/></span>
          </S.wRow>
          <BarLineChart carbonData={carbonData} BarSelectedYear={BarSelectedYear}/>
        </S.MiddleLeft>
        <S.MiddleRight>
          <S.wRow>
            <div>
              {/* <img src={calendar} alt="calendar" /> */}
              <p>우리 동네에서 5월 나의 탄소 점유율</p>
            </div>
            <span></span>
          </S.wRow> 
          <CircleChart />
        </S.MiddleRight>
      </S.DashboardMiddle>

      <S.DashboardBottom>
        <S.BottomTitle>
          <div>
            <img src={co2} alt="co2" />
            탄소 배출량
          </div>
          <span><CarbonDataViewer LineSelectedYear={LineSelectedYear} LineSetSelectedYear={setLineSelectedYear}/></span>
        </S.BottomTitle>
        <LineChart carbonData={carbonData} LineSelectedYear={LineSelectedYear}/>
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
  wRow: styled.div`
    display: flex;
    justify-content: space-between;
    gap: 0.7vw;
    width: 90%;

    span {
      font-size: 18px;
      font-weight: 400;
    } 

    img {
      font-size: 32px;
    }
  `,
  DashboardMiddle: styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40vh;
    padding: 0 7vw;
    margin-bottom: 4vh;
  `,
  MiddleLeft: styled.div`
    display: flex;
    justify-content: space-between;
    width: 70%; 
    font-size: 23px;
    font-weight: 700;
    flex-direction: column;

    div:first-child {
      display: flex;
      align-items: center;
      gap: 0.7vw;

      p {
        white-space: nowrap;
      }
    }

    h4 {
      width: 100%;
      font-size: 18px;
    }
  `,
  MiddleRight: styled.div`
    display: flex;
    justify-content: space-between;
    width: 30%; 
    font-size: 23px;
    font-weight: 700;
    flex-direction: column;

    h4 {
      width: 100%;
      font-size: 18px;
    }
  `,
  DashboardBottom: styled.div`
    width: 100%;
    height: 25vh;
    padding: 0px 10px;
  `,
  BottomTitle: styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 23px;
    font-weight: 700;
    gap: 0.7vw;
    white-space: nowrap;

    span {
      width: auto;
      font-size: 18px;
      font-weight: 400;
    } 
  `,
};