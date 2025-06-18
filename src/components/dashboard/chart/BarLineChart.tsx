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

type BarLineChartProps = {
  carbonData: any;
  BarSelectedYear: string;
}

const BarLineChart = ({ carbonData, BarSelectedYear }: BarLineChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartType | null>(null);

  // 데이터 처리 함수
  const processChartData = () => {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const monthLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    
    const carbonEmissionData: number[] = [];
    const electricityUsageData: number[] = [];
    
    // 선택된 연도의 데이터 가져오기
    const yearData = carbonData && carbonData[Object.keys(carbonData)[0]] && carbonData[Object.keys(carbonData)[0]][BarSelectedYear];
    
    if (yearData) {
      months.forEach(month => {
        const monthData = yearData[month];
        if (monthData) {
          // 탄소 배출량을 kg에서 톤으로 변환 (÷ 1000)
          carbonEmissionData.push(Math.round(monthData.carbon_emission_kgCO2eq / 1000 * 100) / 100);
          // 전기 사용량을 kWh에서 MWh로 변환 (÷ 1000)
          electricityUsageData.push(Math.round(monthData.electricity_usage_kwh / 1000 * 100) / 100);
        } else {
          carbonEmissionData.push(0);
          electricityUsageData.push(0);
        }
      });
    } else {
      // 데이터가 없는 경우 0으로 채우기
      months.forEach(() => {
        carbonEmissionData.push(0);
        electricityUsageData.push(0);
      });
    }
    
    return {
      labels: monthLabels,
      carbonEmissionData,
      electricityUsageData
    };
  };

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

    const { labels, carbonEmissionData, electricityUsageData } = processChartData();

    chartInstance.current = new ChartJS(ctx, {
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: '전기 사용량 (MWh)',
            data: electricityUsageData,
            backgroundColor: Array.from({ length: 12 }, (_, index) =>
              index === currentMonth ? '#FFA048' : '#FFEDD8'
            ),
            yAxisID: 'y',
            barThickness: 20,
          },
          {
            type: 'line',
            label: '탄소 배출량 (tCO2eq)',
            data: carbonEmissionData,
            borderColor: '#3BA881',
            backgroundColor: 'rgba(59, 168, 129, 0.1)',
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
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                if (label.includes('전기')) {
                  return `${label}: ${value} MWh`;
                } else {
                  return `${label}: ${value} tCO2eq`;
                }
              }
            }
          }
        },
        datasets: { bar: { order: 1 }, line: { order: 2 } },
        scales: {
          y: { 
            position: 'left', 
            title: {
              display: true,
              text: '전기 사용량 (MWh)'
            },
            ticks: { 
              stepSize: Math.max(...electricityUsageData) > 0 ? Math.ceil(Math.max(...electricityUsageData) / 5) : 10
            } 
          },
          y1: { 
            position: 'right', 
            title: {
              display: true,
              text: '탄소 배출량 (tCO2eq)'
            },
            grid: { drawOnChartArea: false },
            ticks: {
              stepSize: Math.max(...carbonEmissionData) > 0 ? Math.ceil(Math.max(...carbonEmissionData) / 5) : 5
            }
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [carbonData, BarSelectedYear]);

  // 요약 통계 계산
  const calculateSummary = () => {
    const { carbonEmissionData, electricityUsageData } = processChartData();
    
    const totalElectricity = electricityUsageData.reduce((sum, val) => sum + val, 0);
    const totalCarbon = carbonEmissionData.reduce((sum, val) => sum + val, 0);
    const avgElectricity = totalElectricity / 12;
    const avgCarbon = totalCarbon / 12;
    
    return {
      avgElectricity: Math.round(avgElectricity * 100) / 100,
      avgCarbon: Math.round(avgCarbon * 100) / 100,
      totalElectricity: Math.round(totalElectricity * 100) / 100,
      totalCarbon: Math.round(totalCarbon * 100) / 100
    };
  };

  const summary = calculateSummary();

  return (
    <div
      style={{
        display: 'flex',
        width: '90%',
        height: '40vh',
        borderRadius: '8px',
        padding: '10px',
        marginTop: '1vh',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        backgroundColor: 'white'
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
            탄소 배출량
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
            {BarSelectedYear}년 평균<br />
            전기 사용량 : &nbsp;
            <strong>{summary.avgElectricity} MWh</strong><br />
            탄소 배출량: &nbsp;
            <strong>{summary.avgCarbon} tCO2eq</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarLineChart;