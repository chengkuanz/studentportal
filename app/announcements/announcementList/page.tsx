'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import './announcement.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Course {
    id: string;
    text: string;
    title: string;
    expiryDate: string;
    releaseDate: string;
}

function includesOne(collection: any, search: any) {
    for (let x of search) {
        if (collection.includes(x)) {
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

            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);
            if (!userSnapshot.exists()) return;

            const userData = userSnapshot.data();
            const registeredCourses = userData?.registeredCourses || [];

            if (registeredCourses.length === 0) {
                setCourses([]);
                return;
            }

            const announcementsCollection = collection(db, 'announcements');
            const announcementsSnapshot = await getDocs(announcementsCollection);
            const courseList = announcementsSnapshot.docs
                .filter(x => includesOne(registeredCourses, x.data().activeCourses))
                .map((courseSnapshot) => {
                    const data = courseSnapshot.data() as DocumentData;
                    return {
                        id: courseSnapshot.id,
                        text: data.text,
                        title: data.title,
                        expiryDate: data.expiryDate,
                        releaseDate: data.releaseDate,
                        activeCourses: data.activeCourses,
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
        <div className="container">
            <h1>Your Announcements</h1>
            {courses.length > 0 ? (
                courses.map(course => (
                    <div key={course.id} className="card">
                        <h2>
                            <Link href={`app/announcements/announcementList/${course.id}`} className="link">
                                {course.title}
                            </Link>
                        </h2>
                        <p>{course.text}</p>
                        <div className="dates">
                            <p>Release Date: {new Date(course.releaseDate).toLocaleDateString()}</p>
                            <p>Expiry Date: {new Date(course.expiryDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="noCourses">No announcements available.</p>
            )}
        </div>
    );
}

export default Dashboard;
