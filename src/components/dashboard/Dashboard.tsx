import { useEffect, useState } from 'react';
import StyledDashboard from './StyledDashboard';
import { getAnalyzeCarbonData, getCarbonDB } from '@/api/dashboard/api';
import type { CarbonAnalysisResult } from '@/types/types';
import { useCarbonData } from '@/hooks/dashboard/dashboard';
const Dashboard = () => {

  const [carbonData, setCarbonData] = useState(null);
  const [carbonLoading, setCarbonLoading ] = useState(true);
  const [analyzeCarbonData, setAnalyzeCarbonData] = useState<CarbonAnalysisResult>();
  const [analyzeCarbonLoading, setAnalyzeCarbonLoading] = useState(true);
  //const {latestData, selectedData, availableDates, loading } = useCarbonData('서울특별시_강남구_신사동');
  const {loading } = useCarbonData('서울특별시_강남구_신사동');

  const [barSelectedYear, setBarSelectedYear] = useState("2024");
  const [LineSelectedYear, setLineSelectedYear] = useState("2024");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("01");

  {loading || carbonLoading || analyzeCarbonLoading  || <div>Loading...</div>}

  useEffect(() => {
    const fetchCarbonData = async (address:string) => {
      try{
        setCarbonLoading(true);
        const data = await getCarbonDB(address);
        
        if (data) {
          setCarbonData(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCarbonLoading(false);
      }
    }
    
    const fetchAnalyzeCarbonData = async (address: string, year: string, month?: string) => {
    try {
      setAnalyzeCarbonLoading(true);
      const data = await getAnalyzeCarbonData(address,year,month);
      
      if (data) {
        setAnalyzeCarbonData(data);
      } else {
        console.warn('No analysis data returned');
      }
    } catch (error) {
      console.error('Error analyzing carbon data:', error);
    } finally {
      setAnalyzeCarbonLoading(false);
    }
  };
    fetchCarbonData('서울특별시_강남구_신사동');  
    fetchAnalyzeCarbonData('서울특별시_강남구_신사동',selectedYear);
  },[]);
  //return <CarbonDataViewer/>;
  return <StyledDashboard carbonData = {carbonData} analyzeCarbonData = {analyzeCarbonData} 
  setSelectedMonth = {setSelectedMonth} setSelectedYear = {setSelectedYear} selectedMonth = {selectedMonth}
  selectedYear = {selectedYear} setBarSelectedYear = {setBarSelectedYear}  setLineSelectedYear = {setLineSelectedYear}
  LineSelectedYear={LineSelectedYear} BarSelectedYear = {barSelectedYear}/>;
};

export default Dashboard;
