'use client';
import React from 'react';
import {useTranslation} from "react-i18next";
import "../i18n.js"

const Footer = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    return (
        <div>
            <footer className="container" style={{ color: 'grey' }}>
                <br/>
                <p>{t('footer')}</p>
            </footer>
        </div>
    );
}

export default Footer;