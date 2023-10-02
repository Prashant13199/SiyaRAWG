import React, { useEffect, useState } from 'react';
import { database, auth } from '../firebase';
import '../index.css';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import { Modal } from 'react-bootstrap';
import empty from '../Assets/empty.png'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTheme } from '@mui/material';
import Grow from '@mui/material/Grow';
import CachedIcon from '@mui/icons-material/Cached';
import SingleGameTile from '../Components/SingleGameTile';

export default function Profile() {

  const currentuid = localStorage.getItem('uid')
  const currentusername = localStorage.getItem('username')
  const [currentPhoto, setCurrentPhoto] = useState('')
  const [library, setLibrary] = useState([])
  const [played, setPlayed] = useState([])
  const [favourite, setFavourite] = useState([])
  const [playing, setPlaying] = useState([])
  const history = useHistory()
  const [recommendation, setRecommendation] = useState([])
  const [number, setNumber] = useState(null)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [checked, setChecked] = useState(false);
  const theme = useTheme()
  const [suggestions, setSuggestions] = useState([])
  const [pictures, setPictures] = useState([])

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  useEffect(() => {
    fetchRecommendation();
  }, [number])

  useEffect(() => {
    randomNumber()
  }, [favourite.length])

  const randomNumber = () => {
    setNumber(Math.floor(Math.random() * favourite.length))
  }

  const signOut = () => {
    auth.signOut().then(() => {
      history.push('/')
      localStorage.clear()
      window.location.reload()
    })
  }

  const fetchRecommendation = async () => {
    if (favourite?.length !== 0 && favourite[number]?.game?.publishers.length !== 0) {
      fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&publishers=${favourite[number]?.game?.publishers[0]?.id}&page_size=1000`)
        .then(res => res.json()).then((data) => setRecommendation(data.results)).catch((e) => console.log(e))
    }
  };

  useEffect(() => {
    database.ref(`/Users/${currentuid}`).on('value', snapshot => {
      setCurrentPhoto(snapshot.val()?.photo)
      setChecked(true)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/library`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, game: snap.val().game })
      })
      setLibrary(arr)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/played`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, game: snap.val().game })
      })
      setPlayed(arr)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/favourites`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, game: snap.val().game, type: snap.val().type })
      })
      setFavourite(arr)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Pictures/`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ image: snap.val().url })
      })
      setPictures(arr)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/playing`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, game: snap.val().game, type: snap.val().type })
      })
      setPlaying(arr)
    })
  }, [])


  useEffect(() => {
    database.ref(`/Users/${currentuid}/suggestions`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, game: snap.val().game, by: snap.val().by, byuid: snap.val().byuid })
      })
      setSuggestions(arr)
    })
  }, [])

  const handleChangePicture = (photo) => {
    database.ref(`/Users/${currentuid}`).update({
      photo: photo
    }).then(() => handleClose()).catch((e) => console.log(e))
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size='lg'>
        <Modal.Body cslassName='modal_body' style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
          <h2>Pictures</h2>
          <div className='pictures'>
            {pictures?.map((picture) => {
              return <img src={picture.image} className='picture' onClick={() => handleChangePicture(picture.image)} />
            })}
          </div>
        </Modal.Body>
      </Modal>
      <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
        <div className='Profile'>
          <div className='welcome' style={{ backgroundImage: favourite.length !== 0 && number ? `url(${favourite[number].game.background_image})` : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
            <div className='welcome_backdrop'>
              <div style={{ width: '100%' }}>
                <div className='profile_header'>
                  <div style={{ position: 'relative', width: 'fit-content' }}>
                    <img src={currentPhoto ? currentPhoto : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`} className='profile_image' />
                    <div style={{ position: 'absolute', left: 5, bottom: 5 }}>
                      <IconButton style={{ backgroundColor: theme.palette.background.default }}><CreateIcon color="info" fontSize='small' onClick={() => handleShow()} /></IconButton>
                    </div>
                  </div>
                  <div className="profile_actions">
                    <div className='profile_username'>{currentusername ? currentusername.length > 20 ? currentusername.substring(0, 20).concat('...') : currentusername : 'Loading...'}</div>
                    &nbsp;<IconButton onClick={() => signOut()} style={{ backgroundColor: theme.palette.background.default }}><LogoutIcon color="info" /></IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {playing.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Playing Now ({playing?.length})</div>
            <div className='trending_scroll' data-aos="fade-left">
              {playing && playing.map((data) => {
                return <SingleGameTile data={data.game} key={data.id} />
              })}
            </div></>}
          {library.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Library ({library?.length})</div>
            <div className='trending_scroll' data-aos="fade-left">
              {library && library.map((data) => {
                return <SingleGameTile data={data.game} key={data.id} />
              })}
            </div></>}
          {recommendation.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Recommendation <IconButton className='refresh_icon'><CachedIcon onClick={() => randomNumber()} /></IconButton></div>
            <div className='searchresultfor' data-aos="fade-right">Because you liked {favourite[number]?.game?.name}</div>
            <div className='trending_scroll' data-aos="fade-left">
              {recommendation && recommendation.map((data) => {
                return <SingleGameTile data={data} key={data.id} />
              })}
            </div></>}
          {played.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Played ({played?.length})</div>
            <div className='trending_scroll' data-aos="fade-left">
              {played && played.map((data) => {
                return <SingleGameTile data={data.game} key={data.id} />
              })}
            </div></>}
          {suggestions.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Suggestions ({suggestions?.length})</div>
            <div className='trending_scroll' data-aos="fade-left">
              {suggestions && suggestions.map((data) => {
                return <div>
                  <SingleGameTile data={data.game} key={data.id} by={data.by} byuid={data.byuid} id={data.id} />
                </div>
              })}
            </div></>}
          {favourite.length !== 0 && <><br />
            <div className='trending_title' data-aos="fade-right">Favourites ({favourite?.length})</div>
            <div className='trending_scroll' data-aos="fade-left">
              {favourite && favourite.map((data) => {
                return <SingleGameTile data={data.game} key={data.id} />
              })}
            </div></>}
          {favourite.length === 0 && library.length === 0 && playing.length === 0 && played.length === 0 && <center><br />
            <img src={empty} width={'100px'} height={'auto'} />
            <h6 style={{ color: 'gray' }}>Nothing to show</h6>
            <h3>Add to Watchlist or Favourite to appear here</h3></center>}
        </div>
      </Grow>
    </>
  )
}
