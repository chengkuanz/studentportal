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

export function Hello(props) {
    const {name} = props;
    return <h1>hello, {name} computer</h1>
}




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

                <div className="w-full"><h2 className="mb-8 text-3xl text-center">Add New Course</h2>
                    <Hello name="code"/>
                    <form className="form-lg">
                        <table>
                            <ReadCourse name="Course Name" id="courseName" placeholder="Course Name" value={course.name}
                                        lambda={(e) => setCourse({...course, name: e.target.value})}/>
                            <ReadCourse name="Course Code" id="courseCode" placeholder="e.g. ITAL1000"
                                        value={course.courseCode} lambda={(e) => setCourse({
                                ...course,
                                courseCode: e.target.value.replace(/\s/g, '')
                            })}/>
                            <ReadCourse name="Course Section" id="courseSection" placeholder="e.g. A"
                                        value={course.section} lambda={(e) => setCourse({
                                ...course,
                                section: e.target.value.replace(/\s/g, '')
                            })}/>

                            <ReadCourse name="Location" id="location"
                                        placeholder="(optional, leave blank if class is virtual)"
                                        value={course.location}
                                        lambda={(e) => setCourse({...course, location: e.target.value})}/>

                            <ReadCourse name="Year" id="year" placeholder="e.g. 2025"
                                        value={course.year} lambda={(e) => setCourse({
                                ...course,
                                year: e.target.value.replace(/\s/g, '')
                            })}/>

                            <ReadCheck name="Is this class virtual?" id="virtualClass"
                                       value={course.isVirtual}
                                       lambda={(e) => setCourse({...course, isVirtual: e.target.checked})}/>

                            <ReadCheck name="Is this class actively running?" id="activeClass"
                                       value={course.activeCourse}
                                       lambda={(e) => setCourse({...course, activeCourse: e.target.checked})}/>

                            <ReadList name="Semester" id="semester" list={["", "Winter", "Spring", "Summer", "Fall"]}
                                      value={course.semester}
                                      lambda={(e) => setCourse({...course, semester: e.target.value})}/>

                            <ReadList name="Day" id="day"
                                      list={["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}
                                      value={course.dayOfWeek}
                                      lambda={(e) => setCourse({...course, dayOfWeek: e.target.value})}/>

                            <ReadTime name="Time" id="time"
                                      value={course.time} lambda={(e) => setCourse({...course, time: e.target.value})}/>

                            <UploadFile name="Banner Picture Upload" id="file" lambda={(e) => {
                                setBannerUpload(e.target.files[0]);
                            }} upload={bannerUpload}/>


                        </table>

                        <ReadText name="Course Description" id="courseDescription" placeholder="Course Description"
                                  value={course.description} lambda={(e) =>
                            setCourse({...course, description: e.target.value})}/>





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



