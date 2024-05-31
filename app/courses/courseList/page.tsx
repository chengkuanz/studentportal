'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
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
            <h1>Courses available this semester:</h1>

            {courses.length > 0 ? (
                <table style={{ width: '100%' }}>
                    <thead>
                    <tr>'use client'; // This is a client component
                        import React, { useEffect, useState } from 'react';
                        import { collection, getDocs, DocumentData } from 'firebase/firestore';
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
                        <h1>Courses available this semester:</h1>

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
                            <p>No courses available</p>
                        )}
                    </div>
                    );
                    }

                    export default Dashboard;

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
                <p>No courses available</p>
            )}
        </div>
    );
}

export default Dashboard;
