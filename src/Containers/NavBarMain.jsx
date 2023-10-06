import React, { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../Assets/logo.png'
import { NavLink, useLocation } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People';
import { Button } from '@mui/material';
import { Modal } from 'react-bootstrap';
import Login from './Login';
import Register from './Register';
import { auth, database } from '../firebase';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import '../index.css'

export default function NavBarMain({ top }) {

  const [currentPhoto, setCurrentPhoto] = useState("")
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const location = useLocation()
  const theme = useTheme()

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}`).on('value', snapshot => {
      setCurrentPhoto(snapshot.val()?.photo)
    })
  }, [auth?.currentUser?.uid])

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <Login handleClose={handleClose} />
        </Modal.Body>
      </Modal>
      <Modal show={show2} onHide={handleClose2} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <Register handleClose2={handleClose2} />
        </Modal.Body>
      </Modal>
      <Navbar className={top < 50 ? 'navbar navbar_back_image' : 'navbar navbar_back'} variant={theme.palette.mode} fixed='top'>
        <Navbar.Brand>
          <NavLink to="/">
            <img src={logo} className='logo' alt="logo" />
          </NavLink>
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
        <Nav>
          <NavLink to='/search' activeClassName="is-active" className="navlink"
            exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary }} activeStyle={{ color: theme.palette.success.main }}>
            {auth?.currentUser?.uid ? <div className='search_placeholder'><SearchIcon /> Search</div> : <SearchIcon />}
          </NavLink>
        </Nav>
        {auth?.currentUser?.uid && <>
          <Nav><NavLink to='/users' activeClassName="is-active" className="navlink" exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary }} activeStyle={{ color: theme.palette.success.main }}><PeopleIcon /></NavLink></Nav></>}
        {auth?.currentUser?.uid ? <Nav>
          <NavLink to='/profile' activeClassName="is-active" style={{ textDecoration: 'none', color: 'white' }} className="navlink" activeStyle={{ color: theme.palette.success.main }}
            exact={true}><img alt="" src={currentPhoto ? currentPhoto : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`} className={location && location.pathname === '/profile' ? 'navbar__img_active' : 'navbar__img'} /></NavLink>
        </Nav>
          :
          <Nav>
            <Button color='success' onClick={handleShow}>Login</Button>
            <Button color='success' onClick={handleShow2}>Register</Button>
          </Nav>
        }
      </Navbar>
    </>
  )
}
