"use client"; // This is a client component
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../config/firebase';
import { useTranslation } from "react-i18next";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import "../i18n.js";
import 'bootstrap/dist/css/bootstrap.min.css';

interface FormData {
    email?: string;
    firstName?: string;
    lastName?: string;
    studentNumber?: string;
    program?: string;
    department?: string;
    title?: string;
    profilePhoto?: string;
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
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProfilePhoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (profilePhoto && user) {
                const storageRef = ref(storage, `profilePhotos/${user.uid}`);
                await uploadBytes(storageRef, profilePhoto);
                const photoURL = await getDownloadURL(storageRef);
                formData.profilePhoto = photoURL;
            }
            await setDoc(doc(db, 'users', user.uid), formData, { merge: true });
            setUserData({ ...userData, ...formData });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user information:', error);
        }
    };

    const handleUploadPhoto = async () => {
        if (profilePhoto && user) {
            try {
                const storageRef = ref(storage, `profilePhotos/${user.uid}`);
                await uploadBytes(storageRef, profilePhoto);
                const photoURL = await getDownloadURL(storageRef);
                setUserData({ ...userData, profilePhoto: photoURL });
                await setDoc(doc(db, 'users', user.uid), { profilePhoto: photoURL }, { merge: true });
                setProfilePhoto(null); // Clear the photo input after upload
            } catch (error) {
                console.error('Error uploading profile photo:', error);
            }
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-body">
                    <h1 className="card-title text-center mb-4">{t('profile')}</h1>
                    <div className="text-center mb-4">
                        {userData.profilePhoto ? (
                            <img src={userData.profilePhoto} alt="Profile" className="img-thumbnail"
                                 style={{width: '150px', height: '150px'}}/>
                        ) : (
                            <div className="img-thumbnail"
                                 style={{width: '150px', height: '150px', lineHeight: '150px'}}>
                                {t('no-photo')}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputProfilePhoto" className="form-label fw-bold">
                            {t('profile-photo')}
                        </label>
                        <input
                            type="file"
                            id="inputProfilePhoto"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label fw-bold">{t('email')}</label>
                        <div className="col-sm-9">{userData.email}</div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label fw-bold">{t('user-id')}</label>
                        <div className="col-sm-9">{userData.uid}</div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label fw-bold">{t('f-name')}</label>
                        <div className="col-sm-9">{userData.firstName}</div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label fw-bold">{t('l-name')}</label>
                        <div className="col-sm-9">{userData.lastName}</div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label fw-bold">{t('student-num')}</label>
                        <div className="col-sm-9">{userData.studentNumber}</div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label fw-bold">{t('program')}</label>
                        <div className="col-sm-9">{userData.program}</div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label fw-bold">{t('department')}</label>
                        <div className="col-sm-9">{userData.department}</div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label fw-bold">{t('user-title')}</label>
                        <div className="col-sm-9">{userData.title}</div>
                    </div>

                    {!editMode ? (
                        <button className="btn btn-primary mt-3" onClick={() => setEditMode(true)}>
                            {t('edit')}
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-3 row">
                                <label htmlFor="inputFirstName" className="col-sm-3 col-form-label fw-bold">
                                    {t('f-name')}
                                </label>
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
                                <label htmlFor="inputLastName" className="col-sm-3 col-form-label fw-bold">
                                    {t('l-name')}
                                </label>
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
                                <label htmlFor="inputStudentNumber" className="col-sm-3 col-form-label fw-bold">
                                    {t('student-num')}
                                </label>
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
                                <label htmlFor="inputProgram" className="col-sm-3 col-form-label fw-bold">
                                    {t('program')}
                                </label>
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
                                <label htmlFor="inputDepartment" className="col-sm-3 col-form-label fw-bold">
                                    {t('department')}
                                </label>
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
                                <label htmlFor="inputTitle" className="col-sm-3 col-form-label fw-bold">
                                    {t('user-title')}
                                </label>
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
                            <button type="submit" className="btn btn-primary">
                                {t('save')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default User;
