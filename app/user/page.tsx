"use client"; // This is a client component
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const User = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState({ email: '', uid: '' });

    useEffect(() => {
        if (user) {
            setUserData({ email: user.email, uid: user.uid });
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
            <p>Email: {userData.email}</p>
            <p>User ID: {userData.uid}</p>
        </div>
    );
}

export default User;
