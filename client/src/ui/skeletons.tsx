import { Card, Placeholder, Row, Col } from 'react-bootstrap';

export function ProductListSkeleton() {
    return (
        <Row xs={1} lg={3} md={3} sm={2} className="g-4">
            <ProductItemSkeleton />
            <ProductItemSkeleton />
            <ProductItemSkeleton />
        </Row>
    );
}

export function ProductItemSkeleton() {
    return (
        <Col>
            <Card className="p-0 product_card">
                <div className="card-img-top product_img_placeholder" />
                <Card.Body>
                    <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder animation="glow">
                        <Placeholder xs={6} bg="primary" /> <Placeholder xs={5} />
                    </Placeholder>
                    <Placeholder xs={7} />
                    <Placeholder animation="glow" as={Card.Text}>
                        <Placeholder xs={1} /> <Placeholder xs={1} /> <Placeholder xs={1} /> <Placeholder xs={1} />{' '}
                        <Placeholder xs={1} />
                    </Placeholder>
                </Card.Body>
            </Card>
        </Col>
    );
}
