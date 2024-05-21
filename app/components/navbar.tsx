"use client"; // This is a client component
import React from 'react'
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
//legacyBehavior is used to linking a Bootstrap Navbar correctly with nextjs after next v13.x.x

const NavbarComp = () => {
    const { user, logout } = useAuth()
    const router = useRouter()
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Link href="/" passHref legacyBehavior>
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
                        <NavDropdown title="My Courses" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/course/list">Course List</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/course/add">Add Course</NavDropdown.Item>
                            <NavDropdown.Divider />
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarComp

// reference:
//https://nextjs.org/docs/pages/building-your-application/upgrading/codemods#new-link
