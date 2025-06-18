import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map as MapboxMap, Marker, Popup } from 'mapbox-gl'; // Marker, Popup 추가
import 'mapbox-gl/dist/mapbox-gl.css';
import { database as db } from '../../firebase-config';
import { ref, onValue, off } from 'firebase/database';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// 데이터 구조 정의
interface CarbonData {
  id: string;
  latitude: number;
  longitude: number;
  carbon_emission_kgCO2eq: number;
  full_address: string;
  electricity_usage_kwh?: number;
  year: string;
  month: string;
}

interface MapViewerProps {
  initialLng?: number;
  initialLat?: number;
  initialZoom?: number;
}

const MapViewer: React.FC<MapViewerProps> = ({
  initialLng = 127.022774,
  initialLat = 37.523985,
  initialZoom = 15,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);

  const [allData, setAllData] = useState<CarbonData[]>([]);
  const [filteredData, setFilteredData] = useState<CarbonData[]>([]);

  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResultMarker, setSearchResultMarker] = useState<Marker | null>(
    null
  );

  const mapStyle = 'mapbox://styles/mapbox/standard';

  // Firebase에서 데이터 불러오기
  useEffect(() => {
    const dataRef = ref(db, 'carbon_data');
    const listener = onValue(
      dataRef,
      (snapshot) => {
        const rawData = snapshot.val();
        if (rawData) {
          const processedData: CarbonData[] = [];
          const yearSet = new Set<string>();

          Object.keys(rawData).forEach((addressKey) => {
            const addressData = rawData[addressKey];
            if (addressData && typeof addressData === 'object') {
              Object.keys(addressData).forEach((bunjiKey) => {
                const bunjiData = addressData[bunjiKey];
                if (bunjiData && typeof bunjiData === 'object') {
                  Object.keys(bunjiData).forEach((yearKey) => {
                    const yearData = bunjiData[yearKey];
                    yearSet.add(yearKey);
                    if (yearData && typeof yearData === 'object') {
                      Object.keys(yearData).forEach((monthKey) => {
                        const item = yearData[monthKey];
                        if (
                          item &&
                          item.latitude &&
                          item.longitude &&
                          typeof item.carbon_emission_kgCO2eq !== 'undefined'
                        ) {
                          processedData.push({
                            id: `${addressKey}-${bunjiKey}-${yearKey}-${monthKey}`,
                            latitude: Number(item.latitude),
                            longitude: Number(item.longitude),
                            full_address:
                              item.retrieved_full_address || '주소 정보 없음',
                            carbon_emission_kgCO2eq: Number(
                              item.carbon_emission_kgCO2eq
                            ),
                            electricity_usage_kwh: Number(
                              item.electricity_usage_kwh
                            ),
                            year: yearKey,
                            month: monthKey,
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });

          setAllData(processedData);

          const sortedYears = Array.from(yearSet).sort((a, b) =>
            b.localeCompare(a)
          );
          if (sortedYears.length > 0) {
            const latestYear = sortedYears[0];
            setAvailableYears(sortedYears);
            setSelectedYear(latestYear);

            const monthsForLatestYear = new Set(
              processedData
                .filter((d) => d.year === latestYear)
                .map((d) => d.month)
            );
            const sortedMonths = Array.from(monthsForLatestYear).sort((a, b) =>
              b.localeCompare(a)
            );
            if (sortedMonths.length > 0) {
              setAvailableMonths(sortedMonths);
              setSelectedMonth(sortedMonths[0]);
            }
          }
        } else {
          setAllData([]);
          setFilteredData([]);
        }
      },
      (error) => {
        console.error('Firebase 데이터 읽기 오류:', error);
      }
    );

    return () => {
      off(dataRef, 'value', listener);
    };
  }, []);

  // 선택된 년도/월에 따라 데이터 필터링하기
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const dataForPeriod = allData.filter(
        (d) => d.year === selectedYear && d.month === selectedMonth
      );
      setFilteredData(dataForPeriod);
    }
  }, [selectedYear, selectedMonth, allData]);

  // 년도가 변경되면 해당 년도의 월 목록 업데이트
  useEffect(() => {
    if (selectedYear) {
      const monthsForYear = new Set(
        allData.filter((d) => d.year === selectedYear).map((d) => d.month)
      );
      const sortedMonths = Array.from(monthsForYear).sort((a, b) =>
        b.localeCompare(a)
      );
      setAvailableMonths(sortedMonths);
      if (!monthsForYear.has(selectedMonth) && sortedMonths.length > 0) {
        setSelectedMonth(sortedMonths[0]);
      }
    }
  }, [selectedYear, selectedMonth, allData]);

  // 지도 초기화
  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error('Mapbox Access Token이 설정되지 않았습니다.');
      return;
    }
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [initialLng, initialLat],
      zoom: initialZoom,
      pitch: 45,
      bearing: 0,
      antialias: true,
    });
    mapRef.current = map;

    map.on('load', () => {
      try {
        map.setLanguage('ko');
      } catch (error) {
        console.warn('지도 라벨 언어 설정 중 문제 발생:', error);
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initialLng, initialLat, initialZoom]);

  // 주소 검색 기능
  const handleSearchSubmit = () => {
    if (searchResultMarker) {
      searchResultMarker.remove();
      setSearchResultMarker(null);
    }
    if (!searchTerm.trim()) return;

    const results = allData.filter((item) =>
      item.full_address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (results.length > 0 && mapRef.current) {
      const firstResult = results[0];
      setSelectedYear(firstResult.year);
      setSelectedMonth(firstResult.month);

      mapRef.current.flyTo({
        center: [firstResult.longitude, firstResult.latitude],
        zoom: 17,
        essential: true,
      });

      const popup = new Popup().setHTML(
        `<h5>${firstResult.full_address}</h5><p>${firstResult.year}년 ${firstResult.month}월</p><p>탄소배출량: ${firstResult.carbon_emission_kgCO2eq.toFixed(2)} kgCO₂eq</p>`
      );

      const marker = new Marker({ color: 'red' })
        .setLngLat([firstResult.longitude, firstResult.latitude])
        .setPopup(popup)
        .addTo(mapRef.current);

      setSearchResultMarker(marker);
      marker.togglePopup();
    } else {
      alert('검색 결과가 없습니다.');
    }
  };

  // 필터링된 데이터가 변경될 때마다 Mapbox 마커 업데이트
  useEffect(() => {
    if (!mapRef.current || !filteredData) return;

    const map = mapRef.current;

    const markers: Marker[] = filteredData.map((dataPoint) => {
      const popup = new Popup({ offset: 25 }).setHTML(`
          <strong>주소:</strong> ${dataPoint.full_address}<br/>
          <strong>기간:</strong> ${dataPoint.year}년 ${dataPoint.month}월<br/>
          <strong>전기사용량:</strong> ${dataPoint.electricity_usage_kwh?.toFixed(2) || '정보 없음'} kWh<br/>
          <strong>탄소배출량:</strong> ${dataPoint.carbon_emission_kgCO2eq.toFixed(2)} kgCO₂eq
        `);

      return new Marker()
        .setLngLat([dataPoint.longitude, dataPoint.latitude])
        .setPopup(popup)
        .addTo(map);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [filteredData]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1,
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <div>
          <input
            type="text"
            placeholder="전체 기간에서 주소 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: '5px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit();
            }}
          />
          <button onClick={handleSearchSubmit}>검색</button>
        </div>
        <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
          <label>기간 선택: </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ marginRight: '5px' }}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}월
              </option>
            ))}
          </select>
        </div>
      </div>

      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapViewer;
