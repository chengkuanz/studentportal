'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface Course {
    id: string;
    name: string;
    courseCode: string;
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
                    courseCode: data.courseCode
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
                <ul>
                    {courses.map(course => (
                        <li key={course.id}>
                            <p>Course Name: {course.name}</p>
                            <p>Course Code: {course.courseCode}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No courses available</p>
            )}
        </div>
    );
}

export default Dashboard;
