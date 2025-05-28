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

const LineChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartType | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const years = [
      '2015',
      '2016',
      '2017',
      '2018',
      '2019',
      '2020',
      '2021',
      '2022',
      '2023',
    ];
    const dataValues = [10, 15, 20, 22, 25, 27, 28, 29, 30];

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Main Power',
            data: dataValues,
            borderColor: '#4AB876',
            backgroundColor: 'rgba(99, 160, 2, 0.49)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        scales: {
          x: {
            display: true,
          },
          y: {
            display: true,
            min: 0,
            max: 30,
            ticks: {
              stepSize: 10,
              callback: (value) => `${value} kg`,
            },
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, []);

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
