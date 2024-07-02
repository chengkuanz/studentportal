'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import './announcement.css';

interface Course {
    id: string;
    name: string;
    courseCode: string;
}

const AnnouncementDetail = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [announcement, setAnnouncement] = useState<DocumentData | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            if (!user || !id) return;

            const docRef = doc(db, 'announcements', id as string);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setAnnouncement(data);

                const activeCourses = data.activeCourses;
                const coursePromises = activeCourses.map((courseId: string) => getDoc(doc(db, 'courses', courseId)));
                const courseSnapshots = await Promise.all(coursePromises);

                const fetchedCourses = courseSnapshots.map((courseSnapshot) => {
                    const courseData = courseSnapshot.data() as DocumentData;
                    return {
                        id: courseSnapshot.id,
                        name: courseData.name,
                        courseCode: courseData.courseCode,
                    };
                });

                setCourses(fetchedCourses);
            }
        };

        fetchAnnouncement();
    }, [user, id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            {announcement ? (
                <div>
                    <h1>{announcement.title}</h1>
                    <p>{announcement.text}</p>
                    <div className="dates">
                        <p>Release Date: {new Date(announcement.releaseDate).toLocaleDateString()}</p>
                        <p>Expiry Date: {new Date(announcement.expiryDate).toLocaleDateString()}</p>
                    </div>
                    <h2>Active Courses</h2>
                    {courses.length > 0 ? (
                        <ul>
                            {courses.map(course => (
                                <li key={course.id}>
                                    <Link href={`/course/${course.id}`}>
                                        {course.name} ({course.courseCode})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No active courses for this announcement.</p>
                    )}
                </div>
            ) : (
                <p>Loading announcement...</p>
            )}
        </div>
    );
};

export default AnnouncementDetail;
