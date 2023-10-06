
import React, { useState, useEffect } from 'react';
import './index.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './Pages/Home';
import LoadingScreen from 'react-loading-screen';
import logo from './Assets/logo.png'
import { useTheme } from '@mui/material';
import NavBarMain from './Containers/NavBarMain';
import 'bootstrap/dist/css/bootstrap.min.css';
import Search from './Pages/Search';
import SingleContent from './Pages/SingleContent';
import Profile from './Pages/Profile';
import UserProfile from './Pages/UserProfile';
import Users from './Pages/Users';

function App() {

  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const [background, setBackground] = useState('')
  const [top, setTop] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 800);
  }, [])

  const scrollTop = () => {
    document.getElementById('back')?.scrollTo(0, 0)
  }

  useEffect(() => {
    document.getElementById('back')?.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.getElementById('back')?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setTop(document.getElementById('back')?.scrollTop)
  };

  return (

    <LoadingScreen
      loading={loading}
      bgColor='background.default'
      spinnerColor={theme.palette.success.main}
      logoSrc={logo}
    >
      <BrowserRouter>
        <div className="App" style={{ backgroundImage: `url(${background})` }}>
          <div className='backdrop_opacity' id="back">
            <div className='content'>
              <NavBarMain top={top} />
              <Switch>
                <Route path="/" exact>
                  <Home setBackground={setBackground} />
                </Route>
                <Route path="/game/:id" exact>
                  <SingleContent setBackground={setBackground} scrollTop={scrollTop} />
                </Route>
                <Route path="/search">
                  <Search setBackground={setBackground} />
                </Route>
                <Route path='/profile'>
                  <Profile setBackground={setBackground} />
                </Route>
                <Route path='/user/:uid'>
                  <UserProfile setBackground={setBackground} />
                </Route>
                <Route path='/users'>
                  <Users setBackground={setBackground} />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </LoadingScreen>
  );
}

export default App;
