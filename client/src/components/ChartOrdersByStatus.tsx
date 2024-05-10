import { observer } from 'mobx-react-lite';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getDateStart, getLastMonthShortNames, statusStyle } from '../common/utils';
import { useEffect, useRef, useState } from 'react';
import { Container, Form, InputGroup, Row } from 'react-bootstrap';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import { getOrderStatisticByStatus } from '../api/orderApi';
highchartsAccessibility(Highcharts);

const options: Highcharts.Options = {
  colors: Object.keys(statusStyle).map((k) => statusStyle[k].hex),
  chart: {
    type: 'column',
  },
  title: undefined,
  yAxis: {
    min: 0,
    title: {
      text: 'orders',
    },
    stackLabels: {
      enabled: true,
    },
  },
  legend: {
    align: 'left',
    x: 70,
    verticalAlign: 'top',
    y: 10,
    floating: true,
    backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    shadow: false,
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true,
      },
    },
  },
};

const ChartOrdersByStatus = (props: HighchartsReact.Props) => {
  const [chartOptions, setChartOptions] = useState({ ...options, series: [], xAxis: { categories: [] } });
  const [period, setPeriod] = useState(6);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    getOrderStatisticByStatus({ startDate: getDateStart(period), endDate: new Date() })
      .then((result) => {
        // console.log('getOrderStatistic: ', result.data);
        const xAxisCats = getLastMonthShortNames(period).names;
        const series = Object.keys(statusStyle).map((stat) => {
          const monthIndxes = getLastMonthShortNames(period).indexes;
          const data = new Array(monthIndxes.length).fill(0);
          monthIndxes.forEach((val, indx) => {
            if (result.data[val + ''] && result.data[val + ''][stat]) {
              data[indx] = result.data[val + ''][stat];
            }
          });
          return { name: stat, data: data };
        });
        // console.log('series: ', series);
        setChartOptions({ ...chartOptions, series: series, xAxis: { categories: xAxisCats } });
      })
      .catch((error) => console.log(error));
  }, [period]);
  return (
    <Container fluid className="p-0 m-0 mt-3">
      <Row className="d-flex align-items-center">
        <h6 className="col-sm align-middle">ORDERS BY STATUS</h6>
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
    </Container>
  );
};

export default observer(ChartOrdersByStatus);
