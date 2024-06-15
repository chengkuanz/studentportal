'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
import {collection, getDocs, doc, getDoc, DocumentData} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Course {
    id: string;
    text: string;
    title: string;
    expiryDate: string;
    releaseDate: string;

}
function includesOne(collection:any, search:any){
    for (let x of search){
        if(collection.includes(x)){
            return true;
        }
    }
    return false;
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
            const announcementsCollection = collection(db, 'announcements');
            // const announcementPromises = registeredCourses.map((courseId: string) => getDoc(doc(coursesCollection, courseId)));
            // const courseSnapshots = await Promise.all(coursePromises);
            const announcementsSnapshot = await getDocs(announcementsCollection);
            const courseList = announcementsSnapshot.docs.filter(x => includesOne(registeredCourses, x.data().activeCourses)).map((courseSnapshot) => {
                const data = courseSnapshot.data() as DocumentData;
                return {
                    id: courseSnapshot.id,
                    text: data.text,
                    title: data.title,
                    expiryDate: data.expiryDate,
                    releaseDate: data.releaseDate,

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
                width: '90%',
                margin: 'auto',
                textAlign: 'left',
                marginTop: '20px'
            }}
        >
            <h1>Your Announcements</h1>

            {courses.length > 0 ? (
                <table style={{ width: '100%' }}>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>title</th>
                        <th>text</th>
                        <th>releaseDate</th>
                        <th>expiryDate</th>


                    </tr>
                    </thead>
                    <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>
                                <Link href={`/course/${course.id}`}>
                                    {course.id}
                                </Link>
                            </td>
                            <td>{course.title}</td>
                            <td>{course.text}</td>
                            <td>{course.releaseDate}</td>
                            <td>{course.expiryDate}</td>


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
