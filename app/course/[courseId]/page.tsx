'use client'; // This is a client component
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from "@/context/AuthContext";

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
}

const CourseDetails = () => {
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
                    });
                });
                setCourseContents(contents);
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
            <div>
                <h2>Course Contents</h2>
                {courseContents.map((content) => (
                    <div key={content.id} style={{ marginTop: '10px' }}>
                        <h3>{content.title}</h3>
                        <div dangerouslySetInnerHTML={{ __html: content.textContent }} />
                        <p>Open: {content.open}</p>
                        <p>Close: {content.close}</p>
                        <p>Due: {content.due}</p>
                        <p>Type: {content.type}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseDetails;
