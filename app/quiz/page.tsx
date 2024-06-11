'use client'; // This is a client component
import React, { useEffect, useState } from 'react';
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
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [score, setScore] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        setIsSubmitted(true);
    };

    if (!user) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Quizzes</h1>
            {quizzes.length > 0 ? (
                quizzes.map((quiz) => {
                    const course = courses[quiz.courseId];
                    return (
                        <div key={quiz.id} className="mb-5">
                            <h2>{course?.name} ({course?.courseCode})</h2>
                            {quiz.questions.map((question, qIndex) => (
                                <div key={qIndex} className="mb-3">
                                    <p><strong>{question.question}</strong></p>
                                    {question.answers.map((answer, aIndex) => (
                                        <div key={aIndex} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name={`question-${qIndex}`}
                                                id={`question-${qIndex}-answer-${aIndex}`}
                                                value={aIndex}
                                                onChange={() => handleAnswerChange(qIndex, aIndex)}
                                                checked={selectedAnswers[qIndex] === aIndex}
                                                disabled={isSubmitted} // Disable input after submission
                                            />
                                            <label className="form-check-label" htmlFor={`question-${qIndex}-answer-${aIndex}`}>
                                                {answer}
                                            </label>
                                            {isSubmitted && aIndex === question.correctAnswer && (
                                                <span className="text-success"> (Correct answer)</span>
                                            )}
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
            <div className="text-center">
                {!isSubmitted && <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>}
                {score !== null && <h2 className="mt-4">Your score: {score}</h2>}
            </div>
        </div>
    );
};

export default QuizComponent;
