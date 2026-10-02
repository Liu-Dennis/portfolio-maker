import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';

function TextArticle( { title, body } ){
    return (
        <Card className="m-3">
            <Card.Body>
                <Card.Title>{title ? title : "Default Title"}</Card.Title>
                <Card.Text>
                    {body ? body : "Default Body Text"}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
export default TextArticle;
