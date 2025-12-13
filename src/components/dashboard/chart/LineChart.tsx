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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !carbonData) return;

    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 첫 번째 주소의 데이터 가져오기
    const locationKey = Object.keys(carbonData)[0];
    const yearData = carbonData[locationKey]?.[LineSelectedYear];

    if (!yearData) return;

    // 월별 데이터 추출 및 정렬
    const months = Object.keys(yearData).sort();
    if (months.length === 0) return;

    const carbonEmissions = months.map(month => 
      yearData[month]?.carbon_emission_kgCO2eq || 0
    );

    const monthLabels = months.map(month => `${parseInt(month)}월`);

    const maxEmission = Math.max(...carbonEmissions, 1);
    const yAxisMax = Math.ceil(maxEmission / 1000) * 1000;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
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
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: { 
            callbacks: {
              label: (context) => 
                `${context.dataset.label}: ${Math.round(context.parsed.y).toLocaleString()} kgCO2eq`
            }
          },
        },
        scales: {
          x: { title: { display: true, text: '월' } },
          y: {
            min: 0,
            max: yAxisMax,
            ticks: { callback: (value) => `${(value as number).toLocaleString()}` },
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, [carbonData, LineSelectedYear]);

  return (
    <div style={{
      width: '100%',
      height: 200,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      borderRadius: 8,
      marginTop: '1vh',
      padding: 20,
    }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LineChart;