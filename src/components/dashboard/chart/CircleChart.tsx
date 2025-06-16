import { useRef, useEffect } from 'react';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { Chart as ChartType } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const CircleChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartType | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = [170, 24.6];
    const total = data.reduce((sum, v) => sum + v, 0);

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Main Power', 'Green Energy'],
        datasets: [
          {
            data,
            backgroundColor: ['#FFA048', '#3BA881'],
            borderWidth: 0,
          },
        ],
      },
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed}`,
            },
          },

          datalabels: {
            formatter: (value: number) => {
              const percent = (value / total) * 100;
              return `${Math.round(percent)}%`;
            },
            color: '#fff',
            font: {
              weight: 'bold',
              size: 14,
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
        width: 350,
        height: 280,
        padding: 20,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '1.5vw',
        marginTop: '1vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 24,
          marginBottom: 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        <LegendItem
          color="#FFA048"
          label="Main Power"
          description="238 THB"
          bgColor="rgba(255, 160, 72, 0.1)"
        />
        <LegendItem
          color="#3BA881"
          label="Green Energy"
          description="90 THB"
          bgColor="rgba(74, 184, 118, 0.1)"
        />
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
        Total: 194.6
      </div>
      <div
        style={{
          width: 150,
          height: 150,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <canvas ref={canvasRef} />
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: '#666',
            textAlign: 'center',
          }}
        >
          (단위: 구)
        </div>
      </div>
    </div>
  );
};

type LegendItemProps = {
  color: string;
  label: string;
  description?: string;
  bgColor: string;
};

const LegendItem: React.FC<LegendItemProps> = ({
  color,
  label,
  description,
  bgColor,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: 14,
      fontWeight: 400,
      width: 130,
      backgroundColor: bgColor,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
      <span
        style={{
          width: 12,
          height: 12,
          backgroundColor: color,
          marginRight: 8,
          borderRadius: 2,
        }}
      />
      {label}
    </div>
    {description && (
      <div style={{ fontSize: 18, color: '#666', fontWeight: 'bold' }}>
        {description}
      </div>
    )}
  </div>
);

export default CircleChart;
