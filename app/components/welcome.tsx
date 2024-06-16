'use client'; // This is a client component
import React from 'react';
import { Button, Carousel } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

const WelcomeCarousel: React.FC = () => {
    // Inline styles
    const carouselItemStyle: React.CSSProperties = {
        height: '800px',
        width: '100%'
    };

    const imageStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        minHeight: '800px',
        width: '100%'
    };

    return (
        <div>
            <Carousel>
                <Carousel.Item style={carouselItemStyle}>
                    <Image
                        src='/images/welcome1.jpg'
                        alt="First slide"
                        style={imageStyle}
                        fluid
                    />
                    <Carousel.Caption>
                        <h1 className="display-1"
                            style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "100px" }}>
                            Start Your Italian Journey
                        </h1>
                        <br /> <br />
                        <Button variant="primary" size="lg" href="/signup">Sign Up</Button>{' '}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button variant="light" size="lg" href="/login">Log in</Button>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item style={carouselItemStyle}>
                    <Image
                        src='/images/welcome2.jpg'
                        alt="Second slide"
                        style={imageStyle}
                        fluid
                    />
                    <Carousel.Caption>
                        <h1 className="display-1"
                            style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "60px" }}>
                            Watch interactive videos and immerse yourself in Italian Art &amp; Culture
                        </h1>
                        <p>Guarda video interattivi e immergiti nell&apos;arte e nella cultura italiana</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item style={carouselItemStyle}>
                    <Image
                        src='/images/welcome3.jpg'
                        alt="Third slide"
                        style={imageStyle}
                        fluid
                    />
                    <Carousel.Caption>
                        <h1 className="display-1"
                            style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "60px" }}>
                            Master Italian with our engaging learning tools
                        </h1>
                        <p>
                            Padroneggia l&apos;italiano con i nostri coinvolgenti strumenti di apprendimento
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default WelcomeCarousel;
