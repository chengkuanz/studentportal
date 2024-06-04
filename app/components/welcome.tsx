"use client"; // This is a client component
import React from 'react'
import {Button, Carousel} from 'react-bootstrap'
import Image from 'react-bootstrap/Image';

const WelcomeCarousel = () =>{
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
            <Carousel >
                <Carousel.Item>
                    <Image
                        src='/images/welcome1.jpg'
                        alt="First slide"
                        width={2000}
                        height={800}
                    />
                    <Carousel.Caption>
                        <h1 class="display-1"
                            style={{ fontFamily: "Times New Roman, Times, serif" , fontSize: "100px"}}>
                            Start Your Italian Journey
                        </h1>
                        <br/> <br/>
                        <Button variant="primary" size="lg" href="/signup">Sign Up</Button>{' '}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button variant="light" size="lg" href="/login">Log in</Button>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        src='/images/welcome2.jpg'
                        alt="Second slide"
                        width={2000}
                        height={800}
                        fluid
                    />
                    <Carousel.Caption>
                        <h1 className="display-1"
                            style={{fontFamily: "Times New Roman, Times, serif", fontSize: "60px"}}>
                            Watch interactive videos and immerse yourself in Italian Art & Culture
                        </h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        src='/images/welcome3.jpg'
                        alt="Third slide"
                        width={2000}
                        height={800}
                        fluid
                    />
                    <Carousel.Caption>
                        <h1 className="display-1"
                            style={{fontFamily: "Times New Roman, Times, serif", fontSize: "60px"}}>
                            Master italian with our engaging learning tools
                        </h1>
                        <p>
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            </div>
        </main>
    );
}

export default WelcomeCarousel;