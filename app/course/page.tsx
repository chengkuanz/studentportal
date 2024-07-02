'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
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

const RegistrationRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            if (!user) {
                console.log('No user found');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching registration requests...');
                const requestsCollection = collection(db, 'registrationRequests');
                const requestsSnapshot = await getDocs(requestsCollection);

                const requestList = requestsSnapshot.docs.map((doc) => {
                    const data = doc.data() as DocumentData;
                    return {
                        id: doc.id,
                        name: data.name,
                        courseCode: data.courseCode,
                        dayOfWeek: data.dayOfWeek,
                        time: data.time
                    };
                });

                console.log('Fetched requests:', requestList);
                setRequests(requestList);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch registration requests');
                console.error('Error fetching registration requests:', error);
                setLoading(false);
            }
        };

        fetchRequests();
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const colorClasses = ['bg-c-blue', 'bg-c-green', 'bg-c-yellow', 'bg-c-pink'];

    return (
        <div className="cards-container">
            <div className="row">
                {requests.length > 0 ? (
                    requests.map((request, index) => ( // Added parentheses around (request, index)
                        <div className="col-md-4 col-xl-3" key={request.id}>
                            <div className={`card ${colorClasses[index % colorClasses.length]} texts-card`}>
                                <div className="card-block">
                                    <h6 className="m-b-20">{request.name}</h6>
                                    <h2 className="text-right">
                                        <i className="fa fa-book f-left"></i>
                                        <span>{request.courseCode}</span>
                                    </h2>
                                    <p className="m-b-0">Day: <span className="f-right">{request.dayOfWeek}</span></p>
                                    <p className="m-b-0">Time: <span className="f-right">{request.time}</span></p>
                                    <Link href={`/registerCourses/${request.id}`} className="btn btn-primary mt-3">Go to My Course Page</Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Courses Registered</p>
                )}
            </div>
        </div>
    );

};

export default RegistrationRequests;


