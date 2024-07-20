"use client"; // This is a client component
import React from 'react'
import {Button, Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useTranslation } from "react-i18next";
import "../i18n.js"
//legacyBehavior is used to linking a Bootstrap Navbar correctly with nextjs after next v13.x.x

const NavbarComp = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const { user, logout } = useAuth()
    const router = useRouter()
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Link href="/dashboard" passHref legacyBehavior>
                    <Navbar.Brand>{t('lang-learning-student-portal')}</Navbar.Brand>
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
                                    {t('logout')}
                                </Nav.Link>
                            </div>
                        ) : (
                            <>
                                <Link href="/signup" passHref legacyBehavior>
                                    <Nav.Link>{t('signup')}</Nav.Link>
                                </Link>
                                <Link href="/login" passHref legacyBehavior>
                                    <Nav.Link>{t('login')}</Nav.Link>
                                </Link>
                            </>
                        )}
                        <Link href="/quiz" passHref legacyBehavior>
                            <Nav.Link>{t('quiz')}</Nav.Link>
                        </Link>
                        <Link href="/registerCourses" passHref legacyBehavior>
                            <Nav.Link>{t('register')}</Nav.Link>
                        </Link>
                        <Link href="/announcements/announcementList" passHref legacyBehavior>
                            <Nav.Link>{t('announcements')}</Nav.Link>
                        </Link>
                        <NavDropdown title={t('my-courses')} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/courses/courseList">
                                {t('course-list')}
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="/user">{t('profile')}</Nav.Link>
                        <NavDropdown title={t('change-language')} id="basic-nav-dropdown">
                            <NavDropdown.Item>
                                <Button variant="light" onClick={() => changeLanguage('en')}>
                                    English
                                </Button>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Button variant="light" onClick={() => changeLanguage('fr')}>
                                    Français
                                </Button>
                            </NavDropdown.Item>
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
