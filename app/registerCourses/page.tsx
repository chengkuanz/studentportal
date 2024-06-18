'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
import {collection, getDocs, doc, getDoc, DocumentData} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import './styles.css'

interface Course {
    id: string;
    name: string;
    courseCode: string;
    dayOfWeek: string;
    time: string;
}

const CourseList = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);

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
            const coursesSnapshot = await getDocs(coursesCollection);

            // Map over the documents and return the IDs (indexes)
            const courseIndexes = coursesSnapshot.docs.map(doc => doc.id);
            const unregisteredCourses: string[] = courseIndexes.filter(courseId => !registeredCourses.includes(courseId) && !registering.includes(courseId));
            const coursePromises = unregisteredCourses.map((courseId: string) => getDoc(doc(coursesCollection, courseId)));
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
        };

        fetchCourses();
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="row">
            {courses.length > 0 ? (
                courses.map(course => (
                    <div className="col-md-4 col-xl-3" key={course.id}>
                        <div className="card bg-c-green order-card">
                            <div className="card-block">
                                <h6 className="m-b-20">{course.name}</h6>
                                <h2 className="text-right">
                                    <i className="fa fa-book f-left"></i>
                                    <span>{course.courseCode}</span>
                                </h2>
                                <p className="m-b-0">Day: <span className="f-right">{course.dayOfWeek}</span></p>
                                <p className="m-b-0">Time: <span className="f-right">{course.time}</span></p>
                                <Link href={`/registerCourses/${course.id}`} className="btn btn-primary mt-3">Register</Link>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>You have registered for all of the courses</p>
            )}
        </div>
    );
}

export default CourseList;
