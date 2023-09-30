import React, { useContext, useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../Assets/logo.png'
import { NavLink, useLocation } from "react-router-dom";
import TvIcon from '@mui/icons-material/Tv';
import MovieIcon from '@mui/icons-material/Movie';
import PeopleIcon from '@mui/icons-material/People';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Button, IconButton } from '@mui/material';
import { Modal } from 'react-bootstrap';
// import Login from '../Login';
// import Register from '../Register';
// import { database } from '../../firebase';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import '../index.css'
import GamesIcon from '@mui/icons-material/Games';
import PublishIcon from '@mui/icons-material/Publish';

export default function NavBarMain() {

  const uid = localStorage.getItem('uid')
  const [currentPhoto, setCurrentPhoto] = useState("")
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const location = useLocation()
  // const toggleColorMode = useContext(ColorModeContext);
  const theme = useTheme()

  // useEffect(() => {
  //   database.ref(`/Users/${uid}`).on('value', snapshot => {
  //     setCurrentPhoto(snapshot.val()?.photo)
  //   })
  // }, [uid])

  return (
    <>
      {/* <Modal show={show} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <Login />
        </Modal.Body>
      </Modal>
      <Modal show={show2} onHide={handleClose2} centered>
        <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
          <Register />
        </Modal.Body>
      </Modal> */}
      <Navbar bg='dark' variant='dark' fixed='top' style={{ height: '50px', padding: '0px 5px' }}>
        <Navbar.Brand className="navlink">
          <NavLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <div style={{ display: 'flex' }}>
              <img src={logo} height={'35px'} width={'35px'} alt="logo" />
              <div style={{ fontSize: '25px' }}>
                <span style={{ fontSize: '18px', marginLeft: '5px', color: theme.palette.error.main }}>SIYA<strong>RAWG</strong></span>
              </div>
            </div>
          </NavLink>
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
        <Nav>
          <NavLink to='/search' activeClassName="is-active" className="navlink"
            exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary }} activeStyle={{ color: theme.palette.error.main }}><SearchIcon /></NavLink>
        </Nav>
        {uid ? <Nav>
          <NavLink to='/profile' activeClassName="is-active" style={{ textDecoration: 'none', color: 'white' }} className="navlink" activeStyle={{ color: theme.palette.error.main }}
            exact={true}><img alt="" src={currentPhoto ? currentPhoto : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`} className={location && location.pathname === '/profile' ? 'navbar__img_active' : 'navbar__img'} /></NavLink>
        </Nav>
          :
          <Nav>
            {/* <Button color='error' onClick={handleShow}>Login</Button>
            <Button color='error' onClick={handleShow2}>Register</Button> */}
          </Nav>
        }
      </Navbar>
      <Navbar bg='dark' variant='dark' fixed='bottom' style={{ height: '50px', padding: '0px 2px' }}>
        <Nav className="me-auto pc"></Nav>
        <Nav><NavLink to='/' activeClassName="is-active" className="navlink"
          exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary }} activeStyle={{ color: theme.palette.error.main }}><div style={{ display: 'grid', placeItems: 'center' }}><div><GamesIcon /></div><div>Games</div></div></NavLink></Nav>
        <Nav className="me-auto"></Nav>
        <Nav><NavLink to='/platform' activeClassName="is-active" className="navlink"
          exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary }} activeStyle={{ color: theme.palette.error.main }}><div style={{ display: 'grid', placeItems: 'center' }}><div><MovieIcon /></div><div>Platform</div></div></NavLink></Nav>
        <Nav className="me-auto"></Nav>
        <Nav><NavLink to='/genre' activeClassName="is-active" className="navlink"
          exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary }} activeStyle={{ color: theme.palette.error.main }}><div style={{ display: 'grid', placeItems: 'center' }}><div><TvIcon /></div><div>Genre</div></div></NavLink></Nav>
        <Nav className="me-auto"></Nav>
        <Nav><NavLink to='/publisher' activeClassName="is-active" className="navlink"
          exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary }} activeStyle={{ color: theme.palette.error.main }}><div style={{ display: 'grid', placeItems: 'center' }}><div><PublishIcon /></div><div>Publisher</div></div></NavLink></Nav>
        {uid && <><Nav className="me-auto"></Nav>
          <Nav><NavLink to='/people' activeClassName="is-active" className="navlink"
            exact={true} style={{ textDecoration: 'none', color: theme.palette.text.primary }} activeStyle={{ color: theme.palette.error.main }}><div style={{ display: 'grid', placeItems: 'center' }}><div><PeopleIcon /></div><div>Users</div></div></NavLink></Nav></>}
        <Nav className="me-auto pc"></Nav>
      </Navbar>
    </>
  )
}
