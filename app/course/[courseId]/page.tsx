'use client'; // This is a client component
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from "@/context/AuthContext";

//Notes: the name parent director must be the as same as the const which get from useParams

interface Course {
    id: string;
    name: string;
    courseCode: string;
    dayOfWeek: string;
    time: string;
}

const CourseDetails = () => {
    const { user } = useAuth();
    const { courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);

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

        if (user && courseId) {
            fetchCourse();
        }
    }, [user, courseId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (!course) {
        return (
            <div>
                <p>Course ID: {courseId}</p>
                <p>No course found</p>
            </div>
        );
    }

    return (
        <div
            style={{
                width: '60%',
                margin: 'auto',
                textAlign: 'left',
                marginTop: '20px'
            }}
        >
            <table>
                <tbody>
                <tr>
                    <td>{course.name}</td>
                    <td>{course.courseCode}</td>
                    <td>{course.dayOfWeek}</td>
                    <td>{course.time}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CourseDetails;
