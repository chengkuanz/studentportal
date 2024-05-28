"use client"; // This is a client component
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const Signup = () => {
    const { user, signup } = useAuth()
    console.log(user)
    const [data, setData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        studentNumber: '',
    })

    const handleSignup = async (e: any) => {
        e.preventDefault()

        try {
            await signup(data.email, data.password, data.firstName, data.lastName, data.studentNumber)
        } catch (err) {
            console.log(err)
        }

        console.log(data)
    }

    return (
        <div
            style={{
                width: '40%',
                margin: 'auto',
            }}
        >
            <h1 className="text-center my-3 ">Signup</h1>
            <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        required
                        onChange={(e: any) =>
                            setData({
                                ...data,
                                email: e.target.value,
                            })
                        }
                        value={data.email}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        required
                        onChange={(e: any) =>
                            setData({
                                ...data,
                                password: e.target.value,
                            })
                        }
                        value={data.password}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        required
                        onChange={(e: any) =>
                            setData({
                                ...data,
                                firstName: e.target.value,
                            })
                        }
                        value={data.firstName}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        required
                        onChange={(e: any) =>
                            setData({
                                ...data,
                                lastName: e.target.value,
                            })
                        }
                        value={data.lastName}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicStudentNumber">
                    <Form.Label>Student Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter student number"
                        required
                        onChange={(e: any) =>
                            setData({
                                ...data,
                                studentNumber: e.target.value,
                            })
                        }
                        value={data.studentNumber}
                    />
                </Form.Group>


                <Button variant="primary" type="submit">
                    Signup
                </Button>
            </Form>
        </div>
    )
}

export default Signup
