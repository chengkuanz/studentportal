'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
import {collection, getDocs, doc, getDoc, DocumentData} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Course {
    id: string;
    name: string;
    courseCode: string;
    dayOfWeek: string;
    time: string;
}

const Dashboard = () => {
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

            if (registeredCourses.length === 0) {
                setCourses([]);
                return;
            }

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
        };

        fetchCourses();
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div
    style={{
        width: '100%',
        maxWidth: '600px',
        margin: 'auto',
        textAlign: 'left',
        marginTop: '20px',
        padding: '0 10px'
    }}
>
    <h1>Your Registered Courses:</h1>

    {courses.length > 0 ? (
        <table style={{ width: '100%' }}>
            <thead>
            <tr>
                <th>Course Name</th>
                <th>Course Code</th>
                <th>Day of Week</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>
            {courses.map(course => (
                <tr key={course.id}>
                    <td>
                        <Link href={`/course/${course.id}`}>
                            {course.name}
                        </Link>
                    </td>
                    <td>{course.courseCode}</td>
                    <td>{course.dayOfWeek}</td>
                    <td>{course.time}</td>
                </tr>
            ))}
            </tbody>
        </table>
    ) : (
        <p>No courses registered</p>
    )}
</div>
    );
}

export default Dashboard;
