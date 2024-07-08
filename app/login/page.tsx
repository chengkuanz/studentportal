"use client"; // This is a client component
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next';
import "../i18n.js"

const Login = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    const router = useRouter()
    const { user, login } = useAuth()
    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const handleLogin = async (e: any) => {
        e.preventDefault()

        console.log(user)
        try {
            await login(data.email, data.password)
            router.push('/dashboard')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div
            style={{
                width: '40%',
                margin: 'auto',
            }}
        >
            <h1 className="text-center my-3 ">{t('login')}</h1>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control
                        onChange={(e: any) =>
                            setData({
                                ...data,
                                email: e.target.value,
                            })
                        }
                        value={data.email}
                        required
                        type="email"
                        placeholder="Enter email"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control
                        onChange={(e: any) =>
                            setData({
                                ...data,
                                password: e.target.value,
                            })
                        }
                        value={data.password}
                        required
                        type="password"
                        placeholder="Password"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {t('login')}
                </Button>
            </Form>
        </div>
    )
}

export default Login
