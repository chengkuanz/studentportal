'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
import {collection, getDocs, doc, getDoc, DocumentData} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import './styles.css'
import { useTranslation } from 'react-i18next';
import "../../i18n.js"

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
    const [waitingCourses, setWaitingCourses] = useState<Course[]>([]);
    useEffect(() => {
        const fetchCourses = async () => {
            if (!user) return;

            // Fetch user data to get registered courses
            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);
            if (!userSnapshot.exists()) return;

            const userData = userSnapshot.data();
            const registeredCourses = userData?.registeredCourses || [];
            const registering = userData?.registering|| [];
            // if (registeredCourses.length === 0) {
            //     setCourses([]);
            //     return;
            // }

            // Fetch the registered courses
            const coursesCollection = collection(db, 'courses');
            const coursePromises = registeredCourses.map((courseId: string) => getDoc(doc(coursesCollection, courseId)));
            const courseSnapshots = await Promise.all(coursePromises);

            const courseList = courseSnapshots.map((courseSnapshot) => {
                const data = courseSnapshot.data() as DocumentData;
                return {
                    id: courseSnapshot.id,
                    name: data.name,
                    courseCode: data.courseCode,
                    dayOfWeek: data.dayOfWeek,
                    time: data.time,
                };
            });
            setCourses(courseList);


            // Fetch the registered courses

            const coursePromises2 = registering.map((courseId: string) => getDoc(doc(coursesCollection, courseId)));
            const courseSnapshots2 = await Promise.all(coursePromises2);

            const courseList2 = courseSnapshots2.map((courseSnapshot2) => {
                const data = courseSnapshot2.data() as DocumentData;
                return {
                    id: courseSnapshot2.id,
                    name: data.name,
                    courseCode: data.courseCode,
                    dayOfWeek: data.dayOfWeek,
                    time: data.time,
                };
            });
            setWaitingCourses(courseList2);
        };

        fetchCourses();
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }
    const colorClasses = ['bg-c-blue', 'bg-c-green', 'bg-c-yellow', 'bg-c-pink'];
    return (
        <div className="container" >
            <h1>{t('your-registered-courses')}</h1>

            <div className="cards-container">
                <div className="row">
                    {courses.length > 0 ? (
                        courses.map((course, index) => (
                            <div className="col-md-4 col-xl-3" key={course.id}>


                                    <div className={`card ${colorClasses[index % colorClasses.length]} texts-card`}>
                                        <Link href={`/course/${course.id}`}>
                                        <div className="card-block">
                                            <h6 className="m-b-20">{course.name}</h6>
                                            <h2 className="text-right">
                                                <i className="fa fa-book f-left"></i>
                                                <span>{course.courseCode}</span>
                                            </h2>
                                            <p className="m-b-0">{t('day')}: <span
                                                className="f-right">{course.dayOfWeek}</span>
                                            </p>
                                            <p className="m-b-0">{t('time')}: <span className="f-right">{course.time}</span>
                                            </p>

                                        </div>
                                        </Link>
                                    </div>

                            </div>

                        ))
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>



            <h1>{t('waiting-for-register')}</h1>

            <div className="cards-container">
                <div className="row">
                    {waitingCourses.length > 0 ? (
                        waitingCourses.map((course, index) => (
                            <div className="col-md-4 col-xl-3" key={course.id}>
                                <div className={`card ${colorClasses[index % colorClasses.length]} texts-card`}>
                                    <div className="card-block">
                                        <h6 className="m-b-20">{course.name}</h6>
                                        <h2 className="text-right">
                                            <i className="fa fa-book f-left"></i>
                                            <span>{course.courseCode}</span>
                                        </h2>
                                        <p className="m-b-0">{t('day')}: <span className="f-right">{course.dayOfWeek}</span>
                                        </p>
                                        <p className="m-b-0">{t('time')}: <span className="f-right">{course.time}</span></p>

                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
        </div>

    );
}

export default Dashboard;
