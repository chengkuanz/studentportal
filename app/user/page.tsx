"use client"; // This is a client component
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const User = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState({ email: '', uid: '', firstName: '', lastName: '', studentNumber: '' });

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
                        studentNumber: userDataFromDb.studentNumber
                    });
                }
            }
        };

        fetchUserData();
    }, [user, db]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div
            style={{
                width: '40%',
                margin: 'auto',
                textAlign: 'center',
                marginTop: '20px'
            }}
        >
            <h1>User Information</h1>
            <p>Email: {userData.email}</p>
            <p>User ID: {userData.uid}</p>
            <p>First Name: {userData.firstName}</p>
            <p>Last Name: {userData.lastName}</p>
            <p>Student Number: {userData.studentNumber}</p>
        </div>
    );
}

export default User;
