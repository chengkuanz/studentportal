"use client"; // This is a client component
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const User = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState({ email: '' });

    useEffect(() => {
        if (user) {
            setUserData({ email: user.email });
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
        </div>
    );
}

export default User;
