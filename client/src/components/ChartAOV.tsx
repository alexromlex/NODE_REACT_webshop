import { observer } from 'mobx-react-lite';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getDateStart, getLastMonthShortNames } from '../common/utils';
import { useEffect, useRef, useState } from 'react';
import { Form, InputGroup, Row } from 'react-bootstrap';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import { getOrderStatisticAOV } from '../api/orderApi';
highchartsAccessibility(Highcharts);

const options: Highcharts.Options = {
  colors: ['#ff0000'],
  chart: {
    type: 'line',
  },
  title: undefined,
  yAxis: {
    min: 0,
    title: {
      text: 'amount in HUF',
    },
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '<b>{series.name}</b>: {point.y} HUF<br/><b>Orders:</b> {point.qty}',
    // crosshairs: true,
  },
  plotOptions: {
    line: {
      color: '#ff0000',
      dataLabels: {
        enabled: true,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#000000',
        backgroundColor: '#fafafa',
        y: 10,
        formatter: function () {
          return `<b>${this.y.toLocaleString('hu-HU')}</b>`;
        },
      },
      lineWidth: 4,
    },
  },
};

const ChartAOV = (props: HighchartsReact.Props) => {
  const [chartOptions, setChartOptions] = useState({ ...options, series: [], xAxis: { categories: [] } });
  const [period, setPeriod] = useState(6);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    getOrderStatisticAOV({ startDate: getDateStart(period), endDate: new Date() })
      .then((result) => {
        const xAxisCats = getLastMonthShortNames(period).names;
        const monthIndxes = getLastMonthShortNames(period).indexes;
        const series = new Array(monthIndxes.length).fill({ y: 0, qty: 0 });
        monthIndxes.forEach((m, indx) => {
          if (result.data[m]) {
            series[indx] = { y: Number(result.data[m].av.toFixed(0)), qty: result.data[m].orderQty };
          }
        });
        setChartOptions({
          ...chartOptions,
          series: [{ name: 'AOV', data: series }],
          xAxis: { categories: xAxisCats },
        });
      })
      .catch((error) => console.error(error));
  }, [period]);
  return (
    <>
      <Row className="d-flex align-items-center">
        <h6 className="col-sm align-middle">Average Order Value by Month</h6>
        <div className="col-sm-auto ">
          <InputGroup size="sm">
            <InputGroup.Text>Chart period:</InputGroup.Text>
            <Form.Select size="sm" onChange={(e) => setPeriod(Number(e.target.value))} defaultValue={period}>
              {Array.from({ length: 12 }, (value, index) => index + 1).map((el) => (
                <option value={el} key={el}>
                  {el} month
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </div>
      </Row>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartComponentRef} {...props} />
    </>
  );
};

export default observer(ChartAOV);
