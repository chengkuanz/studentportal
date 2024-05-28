"use client"; // This is a client component
import {createContext, useContext, useEffect, useState} from 'react'
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth'
import {auth,db} from '../config/firebase'
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
                                        children,
                                    }: {
    children: React.ReactNode
}) => {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    console.log(user)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                })
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    // const signup = (email: string, password: string) => {
    //     return createUserWithEmailAndPassword(auth, email, password)
    // }
    const signup = async (email: string, password: string, firstName: string, lastName: string, studentNumber: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            firstName: firstName,
            lastName: lastName,
            studentNumber: studentNumber,
            isAdmin: false,
        });
    };

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = async () => {
        setUser(null)
        await signOut(auth)
    }

    return (
        <AuthContext.Provider value={{user, login, signup, logout}}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
