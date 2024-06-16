'use client'; // This is a client component
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc,collection,arrayUnion , addDoc } from 'firebase/firestore';
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
    videoUrl: string;
}

const CourseDetails = () => {
    const { user } = useAuth();
    const { courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [courseContents, setCourseContents] = useState<CourseContent[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchCourse = async () => {
            if (courseId) {
                const courseDoc = doc(db, 'courses', courseId as string);
                const courseSnapshot = await getDoc(courseDoc);
                if (courseSnapshot.exists()) {
                    const data = courseSnapshot.data();
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

        fetchCourse();
    }, [courseId]);
    // Function to add a course to the 'registering' field of a user document
    const addCourseToRegistering = async (userId: string, course: string) => {
        try {
            const userDoc = doc(db, 'users', userId);
            await updateDoc(userDoc, {
                registering: arrayUnion(course)
            });
            console.log('Course added to registering field successfully');
        } catch (error) {
            console.error('Error adding course to registering field: ', error);
        }
    };
    const [userData, setUserData] = useState({ email: '', uid: '', firstName: '', lastName: '', studentNumber: '', program: '', department: '', title: '' });
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userDataFromDb = userDoc.data();
                    setUserData({
                        email: user.email,
                        uid: user.uid,
                        firstName: userDataFromDb.firstName,
                        lastName: userDataFromDb.lastName,
                        studentNumber: userDataFromDb.studentNumber,
                        program: userDataFromDb.program,
                        department: userDataFromDb.department,
                        title: userDataFromDb.title
                    });
                }
            }
        };


        fetchUserData();
    }, [user, db]);
    const handleRegistrationRequest = async () => {
        if (user && course) {
            const { firstName, lastName, studentNumber } = userData;
            console.log(firstName,lastName,studentNumber);

            try {
                await addDoc(collection(db, 'registrationRequests'), {
                    userDocId:user.uid,
                    firstName: firstName,
                    lastName: lastName,
                    studentNumber: studentNumber,
                    courseId: course.id,
                    courseName: course.name,
                    courseCode: course.courseCode,
                    courseDayOfWeek: course.dayOfWeek,
                    courseTime: course.time,
                });

                alert('Registration request submitted successfully');
                addCourseToRegistering(user.uid, course.id)
                router.push('/registerCourses');
            } catch (error) {
                console.error("Error adding registration request: ", error);
                alert('Failed to submit registration request');
            }
        } else {
            alert('User or course information is missing');
        }
    };

    return (
        <div>
            {course ? (
                <div>
                    <h1>{course.name}</h1>
                    <p>Course Code: {course.courseCode}</p>
                    <p>Day of Week: {course.dayOfWeek}</p>
                    <p>Time: {course.time}</p>
                    <button onClick={handleRegistrationRequest}>Register for Course</button>
                </div>
            ) : (
                <p>Loading course details...</p>
            )}
        </div>
    );
};

export default CourseDetails;
