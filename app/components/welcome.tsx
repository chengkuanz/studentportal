"use client"; // This is a client component
import React from 'react'
import {Carousel} from 'react-bootstrap'
import Image from 'react-bootstrap/Image';

const WelcomeCarousel = () =>{
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Carousel data-bs-theme="dark">
                <Carousel.Item>
                    <Image
                        src='/images/welcome1.jpg'
                        alt="First slide"
                        fluid
                    />
                    <Carousel.Caption>
                        <h5>Start Your Italian Journey</h5>
                        <p>button1 button2</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        src='/images/welcome2.jpg'
                        alt="Second slide"
                        fluid
                    />
                    <Carousel.Caption>
                        <h5>Second slide label</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        src='/images/welcome3.jpg'
                        alt="Third slide"
                        fluid

                    />
                    <Carousel.Caption>
                        <h5>Third slide label</h5>
                        <p>
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </main>
    );
}

export default WelcomeCarousel;