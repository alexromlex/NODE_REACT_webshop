import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRef } from 'react';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import { observer } from 'mobx-react-lite';

highchartsAccessibility(Highcharts);

interface ChartProps {
  barColor: string;
  textColor: string;
  barsData: number[];
  barCategories: string[];
}

const ChartBestSellers: React.FC<ChartProps> = ({ barColor, textColor, barsData, barCategories }) => {
  const chartOptions = {
    colors: [barColor],
    chart: { type: 'bar', height: 210 },
    title: undefined,
    xAxis: {
      categories: barCategories,
      title: undefined,
      labels: { enabled: false },
    },
    yAxis: {
      min: 0,
      title: undefined,
      labels: {
        overflow: 'justify',
      },
      gridLineWidth: 0,
    },
    plotOptions: {
      bar: {
        pointWidth: 30,
        borderRadius: '50%',
        dataLabels: {
          enabled: true,
        },
        groupPadding: 0.1,
      },
      series: {
        dataLabels: {
          align: 'left',
          enabled: true,
          color: textColor,
          inside: true,
          verticalAlign: 'top',
          formatter: function () {
            return this.key;
          },
          y: 3, // 10 pixels down from the top
          style: {
            textOutline: 'none', // disable text stroke
            fontSize: '11px',
          },
        },
      },
    },
    tooltip: {
      followPointer: true,
      formatter: function () {
        return `<b>${this.key}</b>: ${this.y}`;
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [{ type: 'bar', data: barsData }],
  };

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  return <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartComponentRef} immutable={true} />;
};

export default observer(ChartBestSellers);
