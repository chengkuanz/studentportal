"use client"; // This is a client component
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {useTranslation} from "react-i18next";
import "../i18n.js"

interface FormData {
    email?: string;
    firstName?: string;
    lastName?: string;
    studentNumber?: string;
    program?: string;
    department?: string;
    title?: string;
}

const User = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const { user } = useAuth();
    const [userData, setUserData] = useState({ email: '', uid: '', firstName: '', lastName: '', studentNumber: '', program: '', department: '', title: '' });
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<FormData>({});

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'users', user.uid), formData, { merge: true });
            // Update userData state with updated data
            setUserData({ ...userData, ...formData });
            // Disable edit mode after successful submission
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user information:', error);
        }
    };

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
            <h1>{t('profile')}</h1>
            <p>{t('email')}: {userData.email}</p>
            <p>{t('user-id')}: {userData.uid}</p>
            <p>{t('f-name')}: {userData.firstName}</p>
            <p>{t('l-name')}: {userData.lastName}</p>
            <p>{t('student-num')}: {userData.studentNumber}</p>
            <p>{t('program')}: {userData.program}</p>
            <p>{t('department')}: {userData.department}</p>
            <p>{t('user-title')}: {userData.title}</p>

            {/* Button to toggle edit mode */}
            {!editMode ? (
                <button  className="btn btn-primary mt-3"
                         onClick={() => setEditMode(true)}>{t('edit')}</button>
            ) : (
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-3 row">
                        <label htmlFor="inputFirstName" className="col-sm-3 col-form-label">{t('f-name')}</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                id="inputFirstName"
                                className="form-control"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName || userData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="inputLastName" className="col-sm-3 col-form-label">{t('l-name')}</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                id="inputLastName"
                                className="form-control"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName || userData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="inputStudentNumber" className="col-sm-3 col-form-label">{t('student-num')}</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                id="inputStudentNumber"
                                className="form-control"
                                name="studentNumber"
                                placeholder="Student Number"
                                value={formData.studentNumber || userData.studentNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="inputProgram" className="col-sm-3 col-form-label">{t('program')}</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                id="inputProgram"
                                className="form-control"
                                name="program"
                                placeholder="Program"
                                value={formData.program || userData.program}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="inputDepartment" className="col-sm-3 col-form-label">{t('department')}</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                id="inputDepartment"
                                className="form-control"
                                name="department"
                                placeholder="Department"
                                value={formData.department || userData.department}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="inputTitle" className="col-sm-3 col-form-label">{t('user-title')}</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                id="inputTitle"
                                className="form-control"
                                name="title"
                                placeholder="Title"
                                value={formData.title || userData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">{t('save')}</button>
                </form>


            )}
        </div>
    );
};

export default User;
