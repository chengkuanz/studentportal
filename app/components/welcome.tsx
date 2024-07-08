'use client'; // This is a client component
import React from 'react';
import { Button, Carousel } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useTranslation } from 'react-i18next';
import "../i18n.js"

const WelcomeCarousel: React.FC = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

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
                            {t('start-italian-journey')}
                        </h1>
                        <br /> <br />
                        <Button variant="primary" size="lg" href="/signup">{t('signup')}</Button>{' '}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button variant="light" size="lg" href="/login">{t('login')}</Button>
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
                            {t('carousel-caption-page2')}
                        </h1>
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
                            {t('carousel-caption-page3')}
                        </h1>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default WelcomeCarousel;
