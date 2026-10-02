import Card from 'react-bootstrap/Card';

function DemoWidget(){

    return (
        <Card className="m-3">
            <Card.Body>
                <Card.Title>Demo Widget</Card.Title>
                <Card.Text>
                    This is my widget content.
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
export default DemoWidget;