import React, { useEffect, useState } from 'react';
import { database, auth } from '../firebase';
import '../index.css';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useHistory } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import { Modal } from 'react-bootstrap';
import empty from '../Assets/empty.png'
import { useTheme } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import SingleGameTile from '../Components/SingleGameTile';
import { CircularProgress } from '@mui/material';

export default function Profile({ setBackground }) {

  const [currentUsername, setCurrentUsername] = useState('')
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
  const theme = useTheme()
  const [suggestions, setSuggestions] = useState([])
  const [pictures, setPictures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendation();
    setBackground(favourite[number]?.game?.background_image)
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
    })
  }

  const fetchRecommendation = async () => {
    fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&publishers=${favourite[number]?.game?.publishers[0]?.id}`)
      .then(res => res.json()).then((data) => setRecommendation(data.results)).catch((e) => console.log(e))
  };

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}`).on('value', snapshot => {
      setCurrentPhoto(snapshot.val()?.photo)
      setCurrentUsername(snapshot.val()?.username)
      setLoading(false)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/library`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, game: snap.val().game })
      })
      setLibrary(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/played`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, game: snap.val().game })
      })
      setPlayed(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/favourites`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, game: snap.val().game, type: snap.val().type })
      })
      setFavourite(arr)
    })
    database.ref(`/Pictures/`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ image: snap.val().url })
      })
      setPictures(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/playing`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, game: snap.val().game, type: snap.val().type })
      })
      setPlaying(arr)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/suggestions`).on('value', snapshot => {
      let arr = []
      snapshot?.forEach((snap) => {
        arr.push({ id: snap.val().id, game: snap.val().game, by: snap.val().by, byuid: snap.val().byuid })
      })
      setSuggestions(arr)
    })
  }, [auth?.currentUser?.uid])

  const handleChangePicture = (photo) => {
    database.ref(`/Users/${auth?.currentUser?.uid}`).update({
      photo: photo
    }).then(() => handleClose()).catch((e) => console.log(e))
  }

  return !loading ? (
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

      <div className='Profile'>
        <div className='profile_header'>
          <div style={{ position: 'relative', width: 'fit-content' }}>
            <img src={currentPhoto ? currentPhoto : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`} className='profile_image' />
            <div style={{ position: 'absolute', left: 5, bottom: 5 }}>
              <IconButton style={{ backgroundColor: theme.palette.background.default }}><CreateIcon color="success" fontSize='small' onClick={() => handleShow()} /></IconButton>
            </div>
          </div>
          <div className="profile_actions">
            <div className='profile_username'>{currentUsername ? currentUsername.length > 20 ? currentUsername.substring(0, 20).concat('...') : currentUsername : 'Loading...'}</div>
            &nbsp;<IconButton onClick={() => signOut()} style={{ backgroundColor: theme.palette.background.default }}><LogoutIcon color="success" /></IconButton>
          </div>
        </div>
        {playing.length !== 0 && <><br />
          <div className='trending_title' >Playing Now ({playing?.length})</div>
          <div className='trending_scroll' >
            {playing && playing.map((data) => {
              return <SingleGameTile data={data.game} key={data.id} />
            })}
          </div></>}
        {library.length !== 0 && <><br />
          <div className='trending_title' >Library ({library?.length})</div>
          <div className='trending_scroll' >
            {library && library.map((data) => {
              return <SingleGameTile data={data.game} key={data.id} />
            })}
          </div></>}
        {recommendation.length !== 0 && <><br />
          <div className='trending_title' >Recommendation <IconButton className='refresh_icon'><CachedIcon color="success" onClick={() => randomNumber()} /></IconButton></div>
          <div className='searchresultfor' >Because you liked {favourite[number]?.game?.name}</div>
          <div className='trending_scroll' >
            {recommendation && recommendation.map((data) => {
              return <SingleGameTile data={data} key={data.id} recom={true} />
            })}
          </div></>}
        {played.length !== 0 && <><br />
          <div className='trending_title' >Played ({played?.length})</div>
          <div className='trending_scroll' >
            {played && played.map((data) => {
              return <SingleGameTile data={data.game} key={data.id} />
            })}
          </div></>}
        {suggestions.length !== 0 && <><br />
          <div className='trending_title' >Suggestions ({suggestions?.length})</div>
          <div className='trending_scroll' >
            {suggestions && suggestions.map((data) => {
              return <div>
                <SingleGameTile data={data.game} key={data.id} by={data.by} byuid={data.byuid} id={data.id} />
              </div>
            })}
          </div></>}
        {favourite.length !== 0 && <><br />
          <div className='trending_title' >Favourites ({favourite?.length})</div>
          <div className='trending_scroll' >
            {favourite && favourite.map((data) => {
              return <SingleGameTile data={data.game} key={data.id} />
            })}
          </div></>}
        {favourite.length === 0 && library.length === 0 && playing.length === 0 && played.length === 0 && <center><br />
          <img src={empty} width={'100px'} height={'auto'} />
          <h6 style={{ color: 'gray' }}>Nothing to show</h6></center>}
      </div>

    </>
  )
    : <div className='loading'><CircularProgress color="success" /></div>
}
