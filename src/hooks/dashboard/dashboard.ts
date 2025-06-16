import { getAvailableDates, getCarbonDataByDate, getLatestCarbonData } from "@/api/dashboard/api";
import { useEffect, useState } from "react";

export const useCarbonData = (address: string) => {
  const [latestData, setLatestData] = useState<any>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [availableDates, setAvailableDates] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // 초기 데이터 로드 (가장 최근 데이터)
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [latest, dates] = await Promise.all([
          getLatestCarbonData(address),
          getAvailableDates(address)
        ]);
        
        setLatestData(latest);
        setAvailableDates(dates);
        setSelectedData(latest);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (address) {
      loadInitialData();
    }
  }, [address]);
  
  // 특정 날짜 데이터 선택
  const selectDate = async (year: string, month?: string) => {
    setLoading(true);
    try {
      const data = await getCarbonDataByDate(address, year, month);
      setSelectedData(data);
    } catch (error) {
      console.error('Error loading selected data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    latestData,
    selectedData,
    availableDates,
    loading,
    selectDate
  };
};