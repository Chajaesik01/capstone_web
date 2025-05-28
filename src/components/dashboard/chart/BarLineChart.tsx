import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { Chart as ChartType } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BarLineChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartType | null>(null);

  useEffect(() => {
    const currentMonth = new Date().getMonth();

    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // 기존 차트가 있으면 파기
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const existingChart = ChartJS.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    chartInstance.current = new ChartJS(ctx, {
      data: {
        labels: [
          '1월',
          '2월',
          '3월',
          '4월',
          '5월',
          '6월',
          '7월',
          '8월',
          '9월',
          '10월',
          '11월',
          '12월',
        ],
        datasets: [
          {
            type: 'bar',
            label: '온도',
            data: [120, 135, 148, 162, 155, 178, 185, 192, 175, 165, 158, 170],
            backgroundColor: Array.from({ length: 12 }, (_, index) =>
              index === currentMonth ? '#FFA048' : '#FFEDD8'
            ),
            yAxisID: 'y',
            barThickness: 20,
          },
          {
            type: 'line',
            label: '수익률',
            data: [
              12.5, 15.2, 18.7, 22.1, 19.8, 25.3, 28.4, 31.2, 26.8, 23.5, 20.1,
              24.6,
            ],
            borderColor: '#3BA881',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        datasets: { bar: { order: 1 }, line: { order: 2 } },
        scales: {
          y: { position: 'left', ticks: { stepSize: 40 } },
          y1: { position: 'right', grid: { drawOnChartArea: false } },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        width: '900px',
        height: '280px',
        borderRadius: '8px',
        padding: '10px',
        marginTop: '1vh',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* 차트 영역 */}
      <div style={{ flex: 1 }}>
        <canvas ref={chartRef} />
      </div>

      {/* 커스텀 범례 영역 */}
      <div
        style={{
          width: '150px',
          paddingLeft: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '2px',
                backgroundColor: '#3BA881',
                marginRight: '8px',
              }}
            ></div>
            온도
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#FFA048',
                marginRight: '8px',
                borderRadius: '2px',
              }}
            ></div>
            전기 사용량
          </div>
        </div>

        {/* 전체 요약 */}
        <div>
          <div
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: '#3BA881',
              marginBottom: '10px',
            }}
          ></div>
          <div
            style={{
              fontSize: '11px',
              color: '#666',
              lineHeight: '1.4',
            }}
          >
            평균 전기 사용량은 <br />
            이정도 되고 <br />
            이를 계산한 <br />
            탄소 배출량은
            <br />
            이만큼 입니다
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarLineChart;
