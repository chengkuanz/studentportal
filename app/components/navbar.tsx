"use client"; // This is a client component
import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
//import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

const NavbarComp = () => {
 // const { user, logout } = useAuth()
  //const router = useRouter()
    const [isClient, setIsClient] = useState(false);

  return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>NextJS Firebase Auth</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">

                {isClient && (
                    <>
                        <Link href="/signup" passHref>
                            <Nav.Link>Signup</Nav.Link>
                        </Link>
                        <Link href="/login" passHref>
                            <Nav.Link>Login</Nav.Link>
                        </Link>
                    </>
                )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default NavbarComp
