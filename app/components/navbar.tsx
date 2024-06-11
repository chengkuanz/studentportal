"use client"; // This is a client component
import React from 'react'
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import CourseList from "@/app/courses/courseList/page";
//legacyBehavior is used to linking a Bootstrap Navbar correctly with nextjs after next v13.x.x

const NavbarComp = () => {
    const { user, logout } = useAuth()
    const router = useRouter()
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Link href="/dashboard" passHref legacyBehavior>
                    <Navbar.Brand>Language Learning Student Portal</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user ? (
                            <div>
                                <Nav.Link
                                    onClick={() => {
                                        logout()
                                        router.push('/login')
                                    }}
                                >
                                    Logout
                                </Nav.Link>
                            </div>
                        ) : (
                            <>
                                <Link href="/signup" passHref legacyBehavior>
                                    <Nav.Link>Signup</Nav.Link>
                                </Link>
                                <Link href="/login" passHref legacyBehavior>
                                    <Nav.Link>Login</Nav.Link>
                                </Link>
                            </>
                        )}
                        <Link href="/quiz" passHref legacyBehavior>
                            <Nav.Link>Quiz</Nav.Link>
                        </Link>
                        <Link href="/course" passHref legacyBehavior>
                            <Nav.Link>Course</Nav.Link>
                        </Link>
                        <Link href="/announcements/announcementList" passHref legacyBehavior>
                            <Nav.Link>Announcements</Nav.Link>
                        </Link>
                        <NavDropdown title="My Courses" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/courses/courseList">
                                Course List
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/courses/addCourse">Add Course</NavDropdown.Item>
                            <NavDropdown.Divider />
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="/user">User Info</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarComp

// reference:
//https://nextjs.org/docs/pages/building-your-application/upgrading/codemods#new-link
