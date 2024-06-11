'use client'; // This is a client component
import React, { useEffect, useState, useRef } from 'react';
import './quiz.css';
import { collection, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Quiz {
    id: string;
    contentId: string;
    questions: Question[];
    courseId: string;
}

interface Question {
    answers: string[];
    correctAnswer: number;
    question: string;
}

interface Course {
    id: string;
    name: string;
    courseCode: string;
}

const QuizComponent = () => {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [courses, setCourses] = useState<{ [key: string]: Course }>({});
    const [quizIndex, setQuizIndex] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);

    const Option1 = useRef<HTMLLIElement>(null);
    const Option2 = useRef<HTMLLIElement>(null);
    const Option3 = useRef<HTMLLIElement>(null);
    const Option4 = useRef<HTMLLIElement>(null);
    const OptionArray = [Option1, Option2, Option3, Option4];

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!user) return;

            const quizzesCollection = collection(db, 'quizzes');
            const quizSnapshots = await getDocs(quizzesCollection);
            const quizList = quizSnapshots.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    id: doc.id,
                    contentId: data.contentId,
                    questions: data.questions,
                    courseId: '', // Placeholder for courseId
                };
            });

            // Fetch course details for each quiz based on contentId
            const contentPromises = quizList.map((quiz) => getDoc(doc(db, 'courseContent', quiz.contentId)));
            const contentSnapshots = await Promise.all(contentPromises);
            const courseIds = contentSnapshots.map((contentSnapshot) => {
                const data = contentSnapshot.data() as DocumentData;
                return data.courseDocId;
            });

            const uniqueCourseIds = Array.from(new Set(courseIds)); // Remove duplicates

            const coursePromises = uniqueCourseIds.map((courseId) => getDoc(doc(db, 'courses', courseId)));
            const courseSnapshots = await Promise.all(coursePromises);
            const courseDetails: { [key: string]: Course } = {};
            courseSnapshots.forEach((courseSnapshot) => {
                const data = courseSnapshot.data() as DocumentData;
                courseDetails[courseSnapshot.id] = {
                    id: courseSnapshot.id,
                    name: data.name,
                    courseCode: data.courseCode,
                };
            });
            setCourses(courseDetails);

            // Add courseId to each quiz
            const updatedQuizzes = quizList.map((quiz, index) => ({
                ...quiz,
                courseId: courseIds[index],
            }));
            setQuizzes(updatedQuizzes);
        };

        fetchQuizzes();
    }, [user]);

    const checkAns = (e: React.MouseEvent<HTMLLIElement>, ans: number) => {
        if (lock === false && quizzes.length > 0) {
            const currentQuiz = quizzes[quizIndex];
            const currentQuestion = currentQuiz.questions[questionIndex];

            if (currentQuestion.correctAnswer === ans) {
                e.currentTarget.classList.add("correct");
                setLock(true);
                setScore((prev) => prev + 1);
            } else {
                e.currentTarget.classList.add("wrong");
                setLock(true);
                OptionArray[currentQuestion.correctAnswer].current!.classList.add("correct");
            }
        }
    };

    const next = () => {
        if (lock === true) {
            const currentQuiz = quizzes[quizIndex];
            if (questionIndex === currentQuiz.questions.length - 1) {
                if (quizIndex === quizzes.length - 1) {
                    setResult(true);
                } else {
                    setQuizIndex((prevIndex) => prevIndex + 1);
                    setQuestionIndex(0);
                    resetOptions();
                }
            } else {
                setQuestionIndex((prevIndex) => prevIndex + 1);
                resetOptions();
            }
        }
    };

    const resetOptions = () => {
        setLock(false);
        OptionArray.forEach((option) => {
            option.current!.classList.remove("wrong");
            option.current!.classList.remove("correct");
        });
    };

    const reset = () => {
        setQuizIndex(0);
        setQuestionIndex(0);
        setScore(0);
        setLock(false);
        setResult(false);
    };

    if (!user) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    const currentQuiz = quizzes.length > 0 ? quizzes[quizIndex] : null;
    const currentQuestion = currentQuiz ? currentQuiz.questions[questionIndex] : null;
    const course = currentQuiz ? courses[currentQuiz.courseId] : null;

    return (
        <div className='quizcontainer'>
            {currentQuiz && course && (
                <>
                    <h1>{course.name} ({course.courseCode})</h1>
                    <hr />
                    {!result ? (
                        <>
                            <h2>{questionIndex + 1}. {currentQuestion.question}</h2>
                            <ul>
                                <li ref={Option1} onClick={(e) => checkAns(e, 0)}>{currentQuestion.answers[0]}</li>
                                <li ref={Option2} onClick={(e) => checkAns(e, 1)}>{currentQuestion.answers[1]}</li>
                                <li ref={Option3} onClick={(e) => checkAns(e, 2)}>{currentQuestion.answers[2]}</li>
                                <li ref={Option4} onClick={(e) => checkAns(e, 3)}>{currentQuestion.answers[3]}</li>
                            </ul>
                            <button onClick={next}>Next</button>
                            <div className="index">{questionIndex + 1} of {currentQuiz.questions.length} questions</div>
                        </>
                    ) : (
                        <>
                            <h2>You Scored {score} out of {currentQuiz.questions.length}</h2>
                            <button onClick={reset}>Reset</button>
                        </>
                    )}
                </>
            )}
            {!currentQuiz && <p>No quizzes available</p>}
        </div>
    );
};

export default QuizComponent;


