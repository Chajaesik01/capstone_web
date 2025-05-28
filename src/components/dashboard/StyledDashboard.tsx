import { colors } from '@/styles';

import styled from 'styled-components';
import firstImg from '@/assets/dashboard/1.svg';
import secondImg from '@/assets/dashboard/2.svg';
import thirdImg from '@/assets/dashboard/3.svg';
import fourthImg from '@/assets/dashboard/4.svg';
import fifthImg from '@/assets/dashboard/5.svg';
import home from '@/assets/dashboard/home.svg';
import calendar from '@/assets/dashboard/calendar.svg';

const StyledDashboard = () => {
  return (
    <S.DashboardWrapper>
      <S.DashboardHeader>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={firstImg} alt="firstImg" />
              Overall System
              <br />
              Efficiency
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>70%</S.HeaderItemNumber>
        </S.DashboardHeaderItem>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={secondImg} alt="secondImg" />
              Renewable Energy
              <br />
              Utillization
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>70%</S.HeaderItemNumber>
        </S.DashboardHeaderItem>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={thirdImg} alt="thirdImg" />
              Carbon Emmision
              <br />
              Reduction
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>40%</S.HeaderItemNumber>
        </S.DashboardHeaderItem>
        <S.DashboardHeaderItem>
          <S.HeaderItemTitle>
            <S.Row>
              <img src={fourthImg} alt="fourthImg" />
              Energy Cost
              <br /> Savings
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>
            <S.Row>
              <p>150</p>
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
              Overall System
              <br />
              Carbon Footprint
            </S.Row>
          </S.HeaderItemTitle>
          <S.HeaderItemNumber>
            <S.Row>
              <p>150</p>
              <span>
                metric tons
                <br />
                CO2/year
              </span>
            </S.Row>
          </S.HeaderItemNumber>
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
      </S.DashboardMiddle>

      <S.DashboardBottom></S.DashboardBottom>
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
    height: 25vh;
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
  `,

  MiddleTitle: styled.div`
    display: flex;
    justify-content: space-between;
    width: 70%;
    font-size: 23px;
    font-weight: 700px;
  `,
  DashboardBottom: styled.div`
    width: 100%;
    height: 25vh;
    background-color: green;
  `,
};
