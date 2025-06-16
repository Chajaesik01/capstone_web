import { useRef, useEffect } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import type { Chart as ChartType } from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

type LineChartProps = {
  carbonData: any;
  LineSelectedYear: string;
}

const LineChart = ({carbonData, LineSelectedYear} : LineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartType | null>(null);

  const locationKey = "0536_0009";
  const cData = carbonData?.[locationKey]?.[LineSelectedYear];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cData) return;

    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 월별 데이터 처리
    const months = Object.keys(cData).sort(); // 월을 정렬 (01, 02, 03, ...)
    
    // 각 월의 탄소 배출량 데이터 추출
    const carbonEmissions = months.map(month => {
      const monthData = cData[month];
      return monthData?.carbon_emission_kgCO2eq || 0;
    });

    const monthLabels = months.map(month => `${parseInt(month)}월`);

   
    const maxEmission = Math.max(...carbonEmissions);
    const yAxisMax = Math.ceil(maxEmission / 1000) * 1000; // 1000 단위로 반올림

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: '탄소 배출량 (kgCO2eq)',
            data: carbonEmissions,
            borderColor: '#4AB876',
            backgroundColor: 'rgba(74, 184, 118, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#4AB876',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true,
            position: 'top',
          },
          tooltip: { 
            mode: 'index', 
            intersect: false,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} kgCO2eq`;
              }
            }
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: '월'
            }
          },
          y: {
            display: true,
            min: 0,
            max: yAxisMax,
            title: {
              display: false,
              text: '탄소 배출량 (kgCO2eq)'
            },
            ticks: {
              callback: (value) => `${(value as number).toLocaleString()}`,
            },
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, [cData]);

  return (
    <div
      style={{
        width: '100%',
        height: 200,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1vh',
      }}
    >
      <div style={{ width: '100%', height: '100%' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default LineChart;