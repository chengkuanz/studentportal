"use client"; // This is a client component
import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
//legacyBehavior is used to linking a Bootstrap Navbar correctly with nextjs after next v13.x.x

const NavbarComp = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Link href="/" passHref>
                    <Navbar.Brand>NextJS Firebase Auth</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link href="/signup" passHref legacyBehavior>
                            <Nav.Link>Signup</Nav.Link>
                        </Link>
                        <Link href="/login" passHref legacyBehavior>
                            <Nav.Link>Login</Nav.Link>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarComp

// reference:
//https://nextjs.org/docs/pages/building-your-application/upgrading/codemods#new-link
