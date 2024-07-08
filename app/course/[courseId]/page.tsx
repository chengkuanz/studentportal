'use client'; // This is a client component
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from "@/context/AuthContext";
import styles from './CourseDetails.module.css';
import { useTranslation } from 'react-i18next';
import "../../i18n.js"

interface Course {
    id: string;
    name: string;
    courseCode: string;
    dayOfWeek: string;
    time: string;
}

interface CourseContent {
    id: string;
    title: string;
    textContent: string;
    open: string;
    close: string;
    due: string;
    type: string;
    contentOrder: number;
    courseDocId: string;
    videoUrl: string;
}

const CourseDetails = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const { user } = useAuth();
    const { courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [courseContents, setCourseContents] = useState<CourseContent[]>([]);

    useEffect(() => {
        const fetchCourse = async () => {
            if (courseId) {
                const courseDoc = doc(db, 'courses', courseId as string);
                const courseSnapshot = await getDoc(courseDoc);
                if (courseSnapshot.exists()) {
                    const data = courseSnapshot.data() as DocumentData;
                    setCourse({
                        id: courseSnapshot.id,
                        name: data.name,
                        courseCode: data.courseCode,
                        dayOfWeek: data.dayOfWeek,
                        time: data.time,
                    });
                }
            }
        };

        const fetchCourseContents = async () => {
            if (courseId) {
                const courseContentCollection = collection(db, 'courseContent');
                const q = query(courseContentCollection, where('courseDocId', '==', courseId));
                const querySnapshot = await getDocs(q);
                const contents: CourseContent[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as DocumentData;
                    if (data.type !== 'quiz') {
                        contents.push({
                            id: doc.id,
                            title: data.title,
                            textContent: data.textContent,
                            open: data.open,
                            close: data.close,
                            due: data.due,
                            type: data.type,
                            contentOrder: data.contentOrder,
                            courseDocId: data.courseDocId,
                            videoUrl: data.type === 'video' ? data.videoUrl : '',
                        });
                    }
                });
                setCourseContents(contents.sort((a, b) => a.contentOrder - b.contentOrder));
            }
        };

        if (user && courseId) {
            fetchCourse();
            fetchCourseContents();
        }
    }, [user, courseId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (!course) {
        return (
            <div>
                <p>{t('course-id')}: {courseId}</p>
                <p>{t('no-course-found')}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <tbody>
                <tr>
                    <td>{course.name}</td>
                    <td>{course.courseCode}</td>
                    <td>{course.dayOfWeek}</td>
                    <td>{course.time}</td>
                </tr>
                </tbody>
            </table>
            <div>
                <h2>{t('course contents')}</h2>
                {courseContents.map((content) => (
                    <div key={content.id} className={styles.content}>
                        <h3>{t('chapter')} {content.contentOrder}</h3>
                        <h4>{content.title}</h4>
                        <p><strong>{t('type')}:</strong> {content.type}</p>
                        <div dangerouslySetInnerHTML={{ __html: content.textContent }} />
                        <p><strong>{t('open')}:</strong> {content.open}</p>
                        <p><strong>{t('close')}:</strong> {content.close}</p>
                        <p><strong>{t('due')}:</strong> {content.due}</p>

                        {content.type === 'video' && (
                            <div className={styles.videocontainer}>
                                <video controls>
                                    <source src={content.videoUrl} type="video/mp4" />
                                    {t('not-support-video')}
                                </video>
                                <a href={content.videoUrl} download className={styles.downloadlink}>{t('download')}</a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseDetails;
