'use client';
import React from 'react';

const Features = () => {
    return (
        <main style={{ margin: '100px 0' }}>
            <div className="container marketing">
                <div className="row">
                    <div className="col-lg-4">
                        <img
                            src='/images/computer.png'
                            alt="Placeholder: 140x140"
                            width="140"
                            height="140"
                            className="bd-placeholder-img"
                        />
                        <br />
                        <h2>Interactive Quizzes</h2>
                        <p>Some representative placeholder content for the three columns of text below the carousel. This is the first column.</p>
                    </div>

                    <div className="col-lg-4">
                        <img
                            src='/images/video.png'
                            alt="Placeholder: 140x140"
                            width="140"
                            height="140"
                            className="bd-placeholder-img"
                        />
                        <br />
                        <h2>Diverse videos</h2>
                        <p>Another exciting bit of representative placeholder content. This time, we&apos;ve moved on to the second column.</p>
                    </div>

                    <div className="col-lg-4">
                        <img
                            src='/images/graduation-hat.png'
                            alt="Placeholder: 140x140"
                            width="140"
                            height="140"
                            className="bd-placeholder-img"
                        />
                        <br />
                        <h2>Course materials</h2>
                        <p>And lastly this, the third column of representative placeholder content.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Features;
