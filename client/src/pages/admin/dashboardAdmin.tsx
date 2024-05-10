import { observer } from 'mobx-react-lite';
import ChartOrdersByStatus from '../../components/ChartOrdersByStatus';
import { Badge, Col, Row } from 'react-bootstrap';
import ChartAOV from '../../components/ChartAOV';
import ChartBestSellers from '../../components/ChartBestSellers';
import { useEffect, useState } from 'react';
import { getOrderProductBestSellers, getMonthlySales } from '../../api/orderApi';
import { monthShortNames, statusStyle } from '../../common/utils';
import { getMontlyUserRegs } from '../../api/userApi';

const DashboardAdmin = () => {
  const [productsBestSellers, setProductsBestSellers] = useState({ data: [], cats: [] });
  const [typesBestSellers, setTypesBestSellers] = useState({ data: [], cats: [] });
  const [brandsBestSellers, setBrandsBestSellers] = useState({ data: [], cats: [] });
  const [monthlySales, setMonthlySales] = useState({ cur: 0, prev: 0 });
  const [monthlyUserRegs, setMonthlyUserRegs] = useState({ cur: 0, prev: 0 });

  const minusDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  // const getAllData = useMemo(() => {}, [productsBestSellers, typesBestSellers, brandsBestSellers, monthlySales]);
  useEffect(() => {
    // console.log('useEffect - start!');
    getOrderProductBestSellers({ startDate: minusDays(new Date(), 30), endDate: new Date() })
      .then((result) => {
        setProductsBestSellers({ data: Object.values(result.data.products), cats: Object.keys(result.data.products) });
        setTypesBestSellers({ data: Object.values(result.data.types), cats: Object.keys(result.data.types) });
        setBrandsBestSellers({ data: Object.values(result.data.brands), cats: Object.keys(result.data.brands) });
      })
      .catch((error) => console.log(error));

    const dateEnd = new Date();
    const firstDay = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), 1);
    const dateStart = new Date(firstDay.setMonth(firstDay.getMonth() - 1));

    getMonthlySales(dateStart, dateEnd, ['cancelled'])
      .then(({ data }) => {
        const [monthNow, monthPrev] = [dateEnd.getMonth() + 1, dateEnd.getMonth()];
        const newData = { cur: 0, prev: 0 };
        data.forEach((element: { month: string; sum: string }) => {
          if (Number(element.month) === monthNow) newData.cur = Number(element.sum);
          if (Number(element.month) === monthPrev) newData.prev = Number(element.sum);
        });
        setMonthlySales(newData);
      })
      .catch((error) => console.error(error));

    getMontlyUserRegs(dateStart, dateEnd)
      .then(({ data }) => {
        const [monthNow, monthPrev] = [dateEnd.getMonth() + 1, dateEnd.getMonth()];
        const newData = { cur: 0, prev: 0 };
        data.forEach((element: { month: string; count: string }) => {
          if (Number(element.month) === monthNow) newData.cur = Number(element.count);
          if (Number(element.month) === monthPrev) newData.prev = Number(element.count);
        });
        setMonthlyUserRegs(newData);
      })
      .catch((error) => console.error(error));
  }, []);
  return (
    <div className="m-0 p-0">
      <Row className="m-0 p-0 gap-3">
        <div className="p-0 m-0 col-sm-auto">
          <section>
            <h6>MONTHLY SALES</h6>
            <div className="fs-4 fw-bolder">{monthlySales.cur.toLocaleString('hu-HU')} HUF</div>
            <div className="fs-11">Prev month ({monthShortNames[new Date().getMonth() - 1]}):</div>
            <div className="fs-5 fw-bolder">{monthlySales.prev.toLocaleString('hu-HU')} HUF</div>
            <div className="fs-11 border-top">
              <Badge bg={statusStyle.cancelled.bg} text={statusStyle.cancelled.text}>
                Cancelled
              </Badge>{' '}
              orders are not included!
            </div>
          </section>

          <section className="mt-3">
            <h6>NEW USERS</h6>
            <Row className="p-0 m-0 gap-1">
              <Col className="p-0">
                <div className="fs-11 text-center">Prev month:</div>
                <div className="fs-5 fw-bolder text-center">{monthlyUserRegs.prev.toLocaleString('hu-HU')}</div>
              </Col>
              <Col className="p-0">
                <div className="fs-11 text-center">Current month:</div>
                <div className="fs-5 fw-bolder text-center">
                  {monthlyUserRegs.cur > 0 && '+'}
                  {monthlyUserRegs.cur.toLocaleString('hu-HU')}
                </div>
              </Col>
            </Row>
          </section>
        </div>
        <div className=" m-0 p-0 col" style={{ maxWidth: 710 }}>
          <ChartAOV />
        </div>
      </Row>
      <ChartOrdersByStatus />
      {/* <ChartUsers /> */}
      <Row>
        <Col>
          <h6>Best sellers (last 30 days)</h6>
          <ChartBestSellers
            barColor={'#6ac3f9'}
            textColor={'#000000'}
            barsData={productsBestSellers.data}
            barCategories={productsBestSellers.cats}
          />
        </Col>
        <Col>
          <h6>Best types (last 30 days)</h6>
          <ChartBestSellers
            barColor={'#eb76ff'}
            textColor={'#000000'}
            barsData={typesBestSellers.data}
            barCategories={typesBestSellers.cats}
          />
        </Col>
        <Col>
          <h6>Best brands (last 30 days)</h6>
          <ChartBestSellers
            barColor={'#ffeb3b'}
            textColor={'#000000'}
            barsData={brandsBestSellers.data}
            barCategories={brandsBestSellers.cats}
          />
        </Col>
      </Row>
    </div>
  );
};

export default observer(DashboardAdmin);
