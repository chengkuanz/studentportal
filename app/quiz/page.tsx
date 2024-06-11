'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';

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
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [score, setScore] = useState<number | null>(null);

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
                };
            });

            setQuizzes(quizList);

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

    const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: answerIndex,
        }));
    };

    const handleSubmit = () => {
        let score = 0;
        quizzes.forEach((quiz) => {
            quiz.questions.forEach((question, index) => {
                if (selectedAnswers[index] === question.correctAnswer) {
                    score++;
                }
            });
        });
        setScore(score);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ width: '80%', margin: 'auto', marginTop: '20px' }}>
            <h1>Quizzes</h1>
            {quizzes.length > 0 ? (
                quizzes.map((quiz) => {
                    const course = courses[quiz.courseId];
                    return (
                        <div key={quiz.id}>
                            <h2>Course: {course?.name} ({course?.courseCode})</h2>
                            {quiz.questions.map((question, qIndex) => (
                                <div key={qIndex} style={{ marginBottom: '20px' }}>
                                    <p>{question.question}</p>
                                    {question.answers.map((answer, aIndex) => (
                                        <div key={aIndex}>
                                            <input
                                                type="radio"
                                                name={`question-${qIndex}`}
                                                value={aIndex}
                                                onChange={() => handleAnswerChange(qIndex, aIndex)}
                                                checked={selectedAnswers[qIndex] === aIndex}
                                            />
                                            <label>{answer}</label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    );
                })
            ) : (
                <p>No quizzes available</p>
            )}
            <button onClick={handleSubmit}>Submit</button>
            {score !== null && <h2>Your score: {score}</h2>}
        </div>
    );
};

export default QuizComponent;
