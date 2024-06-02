"use client"
import styles from "@/styles/Home.module.css";
import {Inter} from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {useAuth} from '@/context/AuthContext'
import CourseCard from "./CourseCard";
import {
    doc,
    setDoc,
    deleteField,
    addDoc,
    collection,
} from "firebase/firestore";
import {db, storage} from "@/config/firebase";
import useFetchCourses from "../hooks/fetchCourses";
import {useRouter} from 'next/navigation';
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";

const inter = Inter({subsets: ["latin"]});

// export function Hello(props) {
//     const {name} = props;
//     return <h1>hello, {name} computer</h1>
// }




const inputClass = "appearance-none rounded border border-[#e0e0e0] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
const checkClass = "form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"

export function ReadCourse(props) {
    const {name, id, placeholder, value, lambda} = props
    return <tr>
        <td><label className="text-blue-800">
            {name}
        </label></td>
        <td>
            <input
                value={value}
                onChange={lambda}
                className={inputClass}
                id={id}
                type="text"
                placeholder={placeholder}
                required
            /></td>
    </tr>
}

export function UploadFile(props) {
    const {name, id, lambda, upload} = props
    return (<tr>
        <td><label className="text-blue-800">
            {name}
        </label></td>
        <td>
            <input
                onChange={lambda}
                className={inputClass}
                name={id}
                id={id}
                type="file"
            />
            <label
                htmlFor={id}
                id="videoFile"
                className="sr-only"
            >
                <div>
                <span
                    className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                  Browse
                </span>
                    {upload &&
                        <p className="text-black">{upload.name}</p>}
                    </div>
            </label>

        </td>
    </tr>)
}


export function ReadText(props) {
    const {name, id, placeholder, value, lambda} = props
    return (<>
        <label className="text-blue-800">
            {name}
        </label>
        <textarea
            rows={5}
            value={value}
            onChange={lambda}
            className={inputClass}
            id={id}
            placeholder={placeholder}
            required
        />
    </>)
}


export function ReadTime(props) {
    const {name, id, value, lambda} = props
    return <tr>
        <td><label className="text-blue-800">
            {name}
        </label></td>
        <td>
            <input
                value={value}
                onChange={lambda}
                className={inputClass}
                id={id}
                type="time"
                required
            /></td>
    </tr>
}


export function ReadList(props) {
    const {name, id, list, value, lambda} = props
    return <tr>
        <td><label className="text-blue-800">
            {name}
        </label></td>
        <td>
            <select
                value={value}
                onChange={lambda}
                className={inputClass}
                id={id}
                required
            >{list.map((a) => {
                return <option value={a}>{a}</option>
            })}</select></td>
    </tr>
}

export function ReadCheck(props) {

    const {name, id, value, lambda} = props
    return <tr>
        <td><label className="text-blue-800">
            {name}
        </label></td>
        <td>
            <input
                checked={value}
                onChange={lambda}
                className={checkClass}
                id={id}
                type="checkbox"
                required
            /></td>
    </tr>
}


export default function AddCourse() {
    const router = useRouter();
    const {userInfo, currentUser} = useAuth();
    const [bannerUpload, setBannerUpload] = useState(null);
    const [course, setCourse] = useState({
        activeCourse: true,
    });

    const [post, setPost] = useState({
         title : "",
        author : "",
        comment : "",
        date : "",
    });


    //console.log(courses)

    // useEffect(() => {
    //     if (!userInfo || Object.keys(userInfo).length === 0) {
    //         setAddCourse(true)
    //     }
    // }, [userInfo])

    async function handleAddCourse() {
        if (!course) {
            return;
        }

        let storageRef;
        let bannerUrl;

        if (bannerUpload) {
            storageRef = ref(storage, `images/${v4() + bannerUpload.name}`);
            await uploadBytes(storageRef, bannerUpload);

            bannerUrl = await getDownloadURL(storageRef);
        } else {
            // Set a default or fallback value for bannerUrl when no file is uploaded
            bannerUrl = ''; // You can set it to an empty string or any other appropriate value
        }
        console.log(bannerUrl)
        const updatedFormData = {
            ...course,
            bannerUrl: bannerUrl,
        };
        const docRef = await addDoc(collection(db, "courses"), updatedFormData);
        setCourse("");
        router.push("/courses");
    }

    return (

        <div className="w-full  text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
            <div className="flex items-center">

                <div className="w-full"><h2 className="mb-8 text-3xl text-center">Add New Comment</h2>

                    <form className="form-lg">
                        <table>
                            <ReadCourse name="Title" id="title" placeholder="Post Title" value={post.title}
                                        lambda={(e) => setPost({...post, title: e.target.value})}/>
                            <ReadCourse name="Author" id="author" placeholder="Author"
                                        value={post.author} lambda={(e) => setPost({
                                ...post,
                                author: e.target.value.replace(/\s/g, '')
                            })}/>
                            <ReadTime name="Date" id="date" value={post.date} lambda={(e) => setPost({
                                ...post,
                                date: e.target.value.replace(/\s/g, '')
                            })}/>




                        </table>

                        <ReadText name="Comment" id="comment" placeholder="Comment"
                                  value={post.comment} lambda={(e) =>
                            setPost({...post, comment: e.target.value})}/>





                        <button
                            onClick={handleAddCourse}
                            className="btn"
                            type="button"
                        >
                            Submit
                        </button>

                    </form>
            </div>
            {/* <input type='text' placeholder="Enter course" value={course} onChange={(e) => setCourse(e.target.value)} className="outline-none p-3 text-base sm:text-lg text-slate-900 flex-1" />
                <button onClick={handleAddCourse} className='w-fit px-4 sm:px-6 py-2 sm:py-3 bg-amber-400 text-white font-medium text-base duration-300 hover:opacity-40'>ADD</button>
          */}{" "}
        </div>
</div>
)
    ;
}



