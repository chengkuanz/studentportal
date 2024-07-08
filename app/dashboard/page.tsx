'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import "../i18n.js"

interface Course {
    id: string;
    name: string;
    courseCode: string;
    dayOfWeek: string;
    time: string;
}

const Dashboard = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesCollection = collection(db, 'courses');
            const courseSnapshot = await getDocs(coursesCollection);
            const courseList = courseSnapshot.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    id: doc.id,
                    name: data.name,
                    courseCode: data.courseCode,
                    dayOfWeek: data.dayOfWeek,
                    time: data.time,
                };
            });
            setCourses(courseList);
        };

        if (user) {
            fetchCourses();
        }
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div
            style={{
                width: '40%',
                margin: 'auto',
                textAlign: 'left',
                marginTop: '20px'
            }}
        >

            <h1>{t('courses-available')}:</h1>

            {courses.length > 0 ? (
                <table style={{width: '100%'}}>
                    <thead>
                    <tr>
                        <th>{t('c-name')}</th>
                        <th>{t('c-code')}</th>
                        <th>{t('day-of-week')}</th>
                        <th>{t('time')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>{course.name}</td>
                            <td>{course.courseCode}</td>
                            <td>{course.dayOfWeek}</td>
                            <td>{course.time}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>


            ) : (
                <p>{t('no-course-available')}</p>
            )}
        </div>

    )
        ;
}

export default Dashboard;
