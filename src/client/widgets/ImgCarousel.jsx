import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';

function ImgCarousel( { urls, title } ){

    let photos = urls.map((url, index) => {
                        return (
                            <Carousel.Item key={index}>
                                <img
                                    src={url}
                                    alt={`Slide ${index + 1}`}
                                    className="d-block w-100"
                                    style={{
                                        height: "5 rem",
                                        objectFit: 'cover'
                                    }}
                                />
                            </Carousel.Item>
                        );
                    })

    return (
        <Card className="m-3">
            <Card.Body>
                {title ? <Card.Title>{title}</Card.Title> : null }
                {/* <Card.Text>
                    This is my widget content.
                </Card.Text> */}
                <Carousel>
                    {photos}
                </Carousel>
            </Card.Body>
        </Card>
    );
}
export default ImgCarousel;
