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
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
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
        const fetchCourses = async () => {
            if (!user) return;

            const coursesCollection = collection(db, 'courses');
            const courseSnapshots = await getDocs(coursesCollection);
            const courseList = courseSnapshots.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    id: doc.id,
                    name: data.name,
                    courseCode: data.courseCode,
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

    if (!user) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    const currentQuestion = selectedQuiz ? selectedQuiz.questions[questionIndex] : null;

    return (
        <div className='quizcontainer'>
            {!selectedCourse ? (
                <>
                    <h1>Select a Course</h1>
                    <ul>
                        {courses.map((course) => (
                            <li key={course.id} onClick={() => { setSelectedCourse(course); fetchQuizzes(course.id); }}>
                                {course.name} ({course.courseCode})
                            </li>
                        ))}
                    </ul>
                </>
            ) : !selectedQuiz ? (
                <>
                    <h1>Select a Quiz for {selectedCourse.name} ({selectedCourse.courseCode})</h1>
                    <ul>
                        {quizzes.map((quiz) => (
                            <li key={quiz.id} onClick={() => setSelectedQuiz(quiz)}>
                                Quiz {quiz.id}
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <h1>{selectedCourse.name} ({selectedCourse.courseCode})</h1>
                    <hr />
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
                                    <div className="index">{questionIndex + 1} of {selectedQuiz.questions.length} questions</div>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <h2>You Scored {score} out of {selectedQuiz.questions.length}</h2>
                            <button onClick={reset}>Reset</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default QuizComponent;
