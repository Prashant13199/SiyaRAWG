
import React, { useState, useEffect } from 'react';
import './index.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './Pages/Home';
import LoadingScreen from 'react-loading-screen';
import logo from './Assets/logo.png'
import { Box, useTheme } from '@mui/material';
import NavBarMain from './Containers/NavBarMain';
import 'bootstrap/dist/css/bootstrap.min.css';
import Search from './Pages/Search';
import SingleContent from './Pages/SingleContent';
import Platform from './Pages/Platform';
import Genre from './Pages/Genre';
import Publisher from './Pages/Publisher';
import SingleType from './Pages/SingleType';

function App() {

  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 800);
  }, [])

  return (

    <LoadingScreen
      loading={loading}
      bgColor='background.default'
      spinnerColor={theme.palette.error.main}
      logoSrc={logo}
    >
      <BrowserRouter>
        <div className="App">
          <NavBarMain />
          <Box sx={{ flexGrow: 1, marginY: 7, marginX: 0.2 }}>
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/game/:id" component={SingleContent} exact />
              <Route path="/search" component={Search} />
              <Route path='/platform' component={Platform} />
              <Route path='/genre' component={Genre} />
              <Route path='/publisher' component={Publisher} />
              <Route path='/singletype/:id/:type/:name' component={SingleType} />
            </Switch>
          </Box>
        </div>
      </BrowserRouter>
    </LoadingScreen>
  );
}

export default App;
