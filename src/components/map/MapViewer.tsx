import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Deck } from '@deck.gl/core';
import type { MapViewState } from '@deck.gl/core';
import { ColumnLayer } from '@deck.gl/layers';
import { database as db } from '../../firebase-config';
import { ref, onValue, off } from 'firebase/database';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface CarbonData {
  id?: string;
  latitude: number;
  longitude: number;
  carbon_emission_kgCO2eq: number;
  full_address?: string;
  electricity_usage_kwh?: number;
}

interface MapViewerProps {
  initialLng?: number;
  initialLat?: number;
  initialZoom?: number;
  mapStyle?: string;
}

const MapViewer: React.FC<MapViewerProps> = ({
  initialLng = 127.022774,
  initialLat = 37.523985,
  initialZoom = 15,
  mapStyle = 'mapbox://styles/mapbox/dark-v11',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const deckRef = useRef<Deck | null>(null);
  const [data, setData] = useState<CarbonData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredData, setFilteredData] = useState<CarbonData[]>([]);
  const [searchResultMarker, setSearchResultMarker] =
    useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    const dataRef = ref(db, 'carbon_data');
    const listener = onValue(
      dataRef,
      (snapshot) => {
        const rawData = snapshot.val();
        if (rawData) {
          const processedData: CarbonData[] = [];
          Object.keys(rawData).forEach((cityKey) => {
            const cityData = rawData[cityKey];
            Object.keys(cityData).forEach((ymKey) => {
              const ymData = cityData[ymKey];
              Object.keys(ymData).forEach((bunjiKey) => {
                const item = ymData[bunjiKey];
                if (
                  item.latitude &&
                  item.longitude &&
                  typeof item.carbon_emission_kgCO2eq !== 'undefined'
                ) {
                  processedData.push({
                    id: `${cityKey}-${ymKey}-${bunjiKey}`,
                    latitude: Number(item.latitude),
                    longitude: Number(item.longitude),
                    carbon_emission_kgCO2eq: Number(
                      item.carbon_emission_kgCO2eq
                    ),
                    full_address:
                      item.full_address || item.api_address_info?.address,
                    electricity_usage_kwh: Number(item.electricity_usage_kwh),
                  });
                }
              });
            });
          });
          setData(processedData);
          setFilteredData(processedData);
        } else {
          setData([]);
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
      pitch: 60,
      bearing: -17.6,
      antialias: true,
    });
    mapRef.current = map;

    deckRef.current = new Deck({
      canvas: map.getCanvas(),
      initialViewState: {
        longitude: initialLng,
        latitude: initialLat,
        zoom: initialZoom,
        pitch: 60,
        bearing: -17.6,
      },
      controller: true,
      onViewStateChange: ({ viewState }: { viewState: MapViewState }) => {
        map.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          pitch: viewState.pitch,
          bearing: viewState.bearing,
        });
      },
      layers: [],
    });

    map.on('load', () => {
      console.log('Mapbox 맵 로드됨, Deck.gl 레이어 준비 중.');
    });

    return () => {
      deckRef.current?.finalize();
      deckRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initialLng, initialLat, initialZoom, mapStyle]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchResultMarker) {
      searchResultMarker.remove();
      setSearchResultMarker(null);
    }

    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }

    const results = data.filter(
      (item) =>
        item.full_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false
    );
    setFilteredData(results);

    if (results.length > 0 && mapRef.current) {
      const firstResult = results[0];
      mapRef.current.flyTo({
        center: [firstResult.longitude, firstResult.latitude],
        zoom: 17,
        essential: true,
      });

      const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat([firstResult.longitude, firstResult.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h5>${firstResult.full_address || '주소 정보 없음'}</h5><p>탄소배출량: ${firstResult.carbon_emission_kgCO2eq.toFixed(2)} kgCO₂eq</p>`
          )
        )
        .addTo(mapRef.current);
      setSearchResultMarker(marker);
    } else {
      alert('검색 결과가 없습니다.');
    }
  };

  useEffect(() => {
    if (deckRef.current) {
      const columnLayer = new ColumnLayer<CarbonData>({
        id: 'carbon-column-layer',
        data: filteredData,
        diskResolution: 12,
        radius: 50,
        extruded: true,
        pickable: true,
        elevationScale: 5,
        getPosition: (d) => [d.longitude, d.latitude],
        getFillColor: (d) => {
          const co2 = d.carbon_emission_kgCO2eq;
          if (co2 > 10000) return [255, 0, 0, 150];
          if (co2 > 5000) return [255, 165, 0, 150];
          return [0, 255, 0, 150];
        },
        getElevation: (d) => d.carbon_emission_kgCO2eq,
        onHover: (info) => {
          if (info.object && info.x && info.y && mapContainerRef.current) {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
              tooltip.style.display = 'block';
              tooltip.style.left = `${info.x}px`;
              tooltip.style.top = `${info.y}px`;
              tooltip.innerHTML = `
                <strong>주소:</strong> ${info.object.full_address || '정보 없음'}<br/>
                <strong>탄소배출량:</strong> ${info.object.carbon_emission_kgCO2eq.toFixed(2)} kgCO₂eq<br/>
                <strong>전기사용량:</strong> ${info.object.electricity_usage_kwh || '정보 없음'} kWh
              `;
            }
          } else {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) tooltip.style.display = 'none';
          }
        },
        onClick: (info) => {
          if (info.object) {
            console.log('클릭된 데이터:', info.object);
          }
        },
      });
      deckRef.current.setProps({ layers: [columnLayer] });
    }
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
        }}
      >
        <input
          type="text"
          placeholder="주소 또는 건물 이름 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: '5px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchSubmit();
          }}
        />
        <button onClick={handleSearchSubmit}>검색</button>
      </div>

      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <div
        id="tooltip"
        style={{
          position: 'absolute',
          display: 'none',
          padding: '5px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#333',
          pointerEvents: 'none',
          zIndex: 9,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          whiteSpace: 'nowrap',
        }}
      ></div>
    </div>
  );
};

export default MapViewer;
