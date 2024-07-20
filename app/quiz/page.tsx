'use client'; // This is a client component
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, doc, getDoc, DocumentData, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './quiz.css';

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
    dayOfWeek: string;
    time: string;
}

const QuizComponent = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [lastScore, setLastScore] = useState<number | null>(null);

    const Option1 = useRef<HTMLLIElement>(null);
    const Option2 = useRef<HTMLLIElement>(null);
    const Option3 = useRef<HTMLLIElement>(null);
    const Option4 = useRef<HTMLLIElement>(null);
    const OptionArray = [Option1, Option2, Option3, Option4];

    useEffect(() => {
        const fetchCourses = async () => {
            if (!user) return;

            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);
            if (!userSnapshot.exists()) return;

            const userData = userSnapshot.data();
            const registeredCourses = userData?.registeredCourses || [];

            if (registeredCourses.length === 0) {
                setCourses([]);
                return;
            }

            const coursesCollection = collection(db, 'courses');
            const coursePromises = registeredCourses.map((courseId: string) => getDoc(doc(coursesCollection, courseId)));
            const courseSnapshots = await Promise.all(coursePromises);

            const courseList = courseSnapshots.map((courseSnapshot) => {
                const data = courseSnapshot.data() as DocumentData;
                return {
                    id: courseSnapshot.id,
                    name: data.name,
                    courseCode: data.courseCode,
                    dayOfWeek: data.dayOfWeek,
                    time: data.time,
                };
            });
            setCourses(courseList);
        };

        fetchCourses();
    }, [user]);

    const fetchQuizzes = async (courseId: string) => {
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

        const contentPromises = quizList.map((quiz) => getDoc(doc(db, 'courseContent', quiz.contentId)));
        const contentSnapshots = await Promise.all(contentPromises);

        const filteredQuizzes = quizList.filter((quiz, index) => {
            const contentSnapshot = contentSnapshots[index];
            if (contentSnapshot.exists()) {
                const data = contentSnapshot.data() as DocumentData;
                return data.courseDocId === courseId;
            }
            return false;
        }).map((quiz, index) => {
            const contentSnapshot = contentSnapshots[index];
            const data = contentSnapshot.data() as DocumentData;
            return {
                ...quiz,
                courseId: data.courseDocId,
            };
        });

        setQuizzes(filteredQuizzes);
    };

    const checkAns = (e: React.MouseEvent<HTMLLIElement>, ans: number) => {
        if (lock === false && selectedQuiz) {
            const currentQuestion = selectedQuiz.questions[questionIndex];

            if (currentQuestion && currentQuestion.correctAnswer === ans) {
                e.currentTarget.classList.add("correct");
                setLock(true);
                setScore((prev) => prev + 1);
            } else {
                e.currentTarget.classList.add("wrong");
                setLock(true);
                if (currentQuestion) {
                    OptionArray[currentQuestion.correctAnswer].current!.classList.add("correct");
                }
            }
        }
    };

    const next = () => {
        if (lock === true && selectedQuiz) {
            if (questionIndex === selectedQuiz.questions.length - 1) {
                setResult(true);
                saveScore();
            } else {
                setQuestionIndex((prevIndex) => prevIndex + 1);
                resetOptions();
            }
        }
    };

    const resetOptions = () => {
        setLock(false);
        OptionArray.forEach((option) => {
            if (option.current) {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
            }
        });
    };

    const reset = () => {
        setSelectedQuiz(null);
        setQuestionIndex(0);
        setScore(0);
        setLock(false);
        setResult(false);
    };

    const saveScore = async () => {
        if (user && selectedCourse && selectedQuiz) {
            const userDocRef = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDocRef);
            const userData = userSnapshot.data();

            const updatedScores = userData?.scores || {};
            updatedScores[selectedQuiz.id] = score;

            await updateDoc(userDocRef, {
                scores: updatedScores
            });
        }
    };

    const selectQuiz = async (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDocRef);
            const userData = userSnapshot.data();
            const lastScore = userData?.scores?.[quiz.id] || null;
            setLastScore(lastScore);
        }
    };

    useEffect(() => {
        // Reset last score when the selected quiz changes
        if (selectedQuiz) {
            setLastScore(null); // Clear lastScore when a new quiz is selected
        }
    }, [selectedQuiz]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const currentQuestion = selectedQuiz ? selectedQuiz.questions[questionIndex] : null;

    return (
        <div className='container mt-5'>
            {!selectedCourse ? (
                <>
                    <h1 className='mb-4'>Your Registered Courses</h1>
                    <div className='list-group'>
                        {courses.map((course) => (
                            <button
                                key={course.id}
                                className='list-group-item list-group-item-action'
                                onClick={() => { setSelectedCourse(course); fetchQuizzes(course.id); }}
                            >
                                {course.name} ({course.courseCode})
                            </button>
                        ))}
                    </div>
                </>
            ) : !selectedQuiz ? (
                <>
                    <h1 className='mb-4'>Select a Quiz for {selectedCourse.name} ({selectedCourse.courseCode})</h1>
                    <div className='list-group'>
                        {quizzes.map((quiz) => (
                            <button
                                key={quiz.id}
                                className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                                onClick={() => selectQuiz(quiz)}
                            >
                                <span>Quiz {quiz.id}</span>
                                {lastScore !== null && (
                                    <span className='mt-4' style={{ color: 'black' }}>Last Score: {lastScore}</span>
                                )}
                            </button>
                        ))}
                    </div>
                    <button className='btn btn-secondary mt-3' onClick={() => setSelectedCourse(null)}>Back to Courses</button>
                </>
            ) : (
                <>
                    <h1 className='mb-4'>{selectedCourse.name} ({selectedCourse.courseCode})</h1>
                    <hr />
                    <div className='quizcontainer'>
                        {!result ? (
                            <>
                                {currentQuestion && (
                                    <>
                                        <h2>{questionIndex + 1}. {currentQuestion.question}</h2>
                                        <ul>
                                            <li ref={Option1} onClick={(e) => checkAns(e, 0)}>{currentQuestion.answers[0]}</li>
                                            <li ref={Option2} onClick={(e) => checkAns(e, 1)}>{currentQuestion.answers[1]}</li>
                                            <li ref={Option3} onClick={(e) => checkAns(e, 2)}>{currentQuestion.answers[2]}</li>
                                            <li ref={Option4} onClick={(e) => checkAns(e, 3)}>{currentQuestion.answers[3]}</li>
                                        </ul>
                                        <button onClick={next}>Next</button>
                                        <div className="index">Question {questionIndex + 1} of {selectedQuiz.questions.length}</div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <h2>You Scored {score} out of {selectedQuiz.questions.length}</h2>
                                <button onClick={reset}>Reset</button>
                            </>
                        )}
                    </div>
                    {lastScore !== null && (
                        <div className='mt-4'>
                            <h3>Last Score: {lastScore}</h3>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default QuizComponent;
