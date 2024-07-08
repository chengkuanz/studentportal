'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData, doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useTranslation} from "react-i18next";
import "../../i18n.js"

interface Announcement {
    id: string;
    text: string;
    title: string;
    expiryDate: string;
    releaseDate: string;
    activeCourses: string[];
}

const includesOne = (collection: string[], search: string[]) => {
    for (let x of search) {
        if (collection.includes(x)) {
            return true;
        }
    }
    return false;
}

const Dashboard = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            if (!user) return;

            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);
            if (!userSnapshot.exists()) return;

            const userData = userSnapshot.data();
            const registeredCourses = userData?.registeredCourses || [];

            if (registeredCourses.length === 0) {
                setAnnouncements([]);
                return;
            }

            const announcementsCollection = collection(db, 'announcements');
            const announcementsSnapshot = await getDocs(announcementsCollection);
            const announcementList = announcementsSnapshot.docs
                .filter(x => includesOne(registeredCourses, x.data().activeCourses))
                .map((announcementSnapshot) => {
                    const data = announcementSnapshot.data() as DocumentData;
                    return {
                        id: announcementSnapshot.id,
                        text: data.text,
                        title: data.title,
                        expiryDate: data.expiryDate,
                        releaseDate: data.releaseDate,
                        activeCourses: data.activeCourses,
                    };
                });
            setAnnouncements(announcementList);
        };

        fetchAnnouncements().catch(console.error);
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleAnnouncementClick = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
    };

    return (
        <div className="container">
            <h1>{t('your-announcements')}</h1>
            {announcements.length > 0 ? (
                <div className="announcement-list">
                    {announcements.map(announcement => (
                        <div key={announcement.id} className="card" onClick={() => handleAnnouncementClick(announcement)}>
                            <h2 className="link">
                                {announcement.title}
                            </h2>
                            <p>{announcement.text}</p>
                            <div className="dates">
                                <p>{t('release-date')}: {new Date(announcement.releaseDate).toLocaleDateString()}</p>
                                <p>{t('expiry-date')}: {new Date(announcement.expiryDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="noAnnouncements">{t('no-announ-avail')}</p>
            )}
            {selectedAnnouncement && (
                <div className="announcement-detail">
                    <h2>{selectedAnnouncement.title}</h2>
                    <p>{selectedAnnouncement.text}</p>
                    <div className="dates">
                        <p>{t('release-date')}: {new Date(selectedAnnouncement.releaseDate).toLocaleDateString()}</p>
                        <p>{t('expiry-date')}: {new Date(selectedAnnouncement.expiryDate).toLocaleDateString()}</p>
                    </div>
                    <h3>{t('active-courses')}</h3>
                    <ul>
                        {selectedAnnouncement.activeCourses.map(courseId => (
                            <li key={courseId}>{courseId}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
