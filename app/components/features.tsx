'use client';
import React from 'react';
import {useTranslation} from "react-i18next";
import "../i18n.js"

const Features = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
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
                        <h2>{t('interactive-quizzes')}</h2>
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
                        <h2>{t('course-materials')}</h2>
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
                        <h2>{t('mobile-app')}</h2>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Features;
