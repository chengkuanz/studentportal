"use client"; // This is a client component
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const User = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState({
        email: '',
        uid: '',
        firstName: '',
        lastName: '',
        studentNumber: '',});

    useEffect(() => {
        if (user) {
            setUserData({ email: user.email, uid: user.uid, firstName: user.firstName, lastName: user.lastName, studentNumber: user.studentNumber });
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
                textAlign: 'center',
                marginTop: '20px'
            }}
        >
            <h1>User Information</h1>
            <p>First name: {userData.firstName}</p>
            <p>Last name: {userData.lastName}</p>
            <p>Student number: {userData.studentNumber}</p>
            <p>Email: {userData.email}</p>
            <p>User ID: {userData.uid}</p>
        </div>
    );
}

export default User;
