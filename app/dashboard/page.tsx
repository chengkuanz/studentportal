'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Define a type for your user data
type UserData = {
    id: string;
    // Add other fields as necessary
};

async function fetchData(): Promise<UserData[]> {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const data: UserData[] = [];
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as UserData);
    });
    return data;
}

function Dashboard() {
    const [data, setData] = useState<UserData[]>([]);

    useEffect(() => {
        fetchData().then((data) => {
            setData(data);
        });
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Users ID list</h2>

            {/* Render your data here */}
            {data.map((user) => (
                <div key={user.id}>
                    <p>ID: {user.id}</p>
                    {/* Render other fields as necessary */}
                </div>
            ))}
        </div>
    );
}

export default Dashboard;
