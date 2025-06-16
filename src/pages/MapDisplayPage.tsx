import React from 'react';
import MapViewer from '../components/map/MapViewer';

const MapDisplayPage: React.FC = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* 페이지 제목이나 다른 UI 요소가 필요하다면 여기에 추가할 수 있습니다. */}
      {/* <h1>3D 탄소 배출량 지도</h1> */}
      <MapViewer
        initialLat={37.523985} // 초기 위도 (예: 신사동)
        initialLng={127.022774} // 초기 경도 (예: 신사동)
        initialZoom={15} // 초기 줌 레벨
      />
    </div>
  );
};

export default MapDisplayPage;
