import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import '../index.css';
import { useParams } from 'react-router-dom';
import empty from '../Assets/empty.png'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Grow from '@mui/material/Grow';
import SingleGameTile from '../Components/SingleGameTile';

export default function UserProfile() {

    const { uid } = useParams()
    const [username, setUsername] = useState('')
    const [photo, setPhoto] = useState('')
    const [library, setLibrary] = useState([])
    const [played, setPlayed] = useState([])
    const [favourite, setFavourite] = useState([])
    const [playing, setPlaying] = useState([])
    const [number, setNumber] = useState(null)
    const [checked, setChecked] = useState(false);
    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        AOS.init({ duration: 800 })
    }, [])

    useEffect(() => {
        randomNumber()
    }, [favourite.length])

    const randomNumber = () => {
        setNumber(Math.floor(Math.random() * favourite.length))
    }

    useEffect(() => {
        database.ref(`/Users/${uid}`).on('value', snapshot => {
            setPhoto(snapshot.val()?.photo)
            setUsername(snapshot.val()?.username)
            setChecked(true)
        })
    }, [])

    useEffect(() => {
        database.ref(`/Users/${uid}/library`).on('value', snapshot => {
            let arr = []
            snapshot?.forEach((snap) => {
                arr.push({ id: snap.val().id, game: snap.val().game })
            })
            setLibrary(arr)
        })
    }, [])

    useEffect(() => {
        database.ref(`/Users/${uid}/played`).on('value', snapshot => {
            let arr = []
            snapshot?.forEach((snap) => {
                arr.push({ id: snap.val().id, game: snap.val().game })
            })
            setPlayed(arr)
        })
    }, [])

    useEffect(() => {
        database.ref(`/Users/${uid}/favourites`).on('value', snapshot => {
            let arr = []
            snapshot?.forEach((snap) => {
                arr.push({ id: snap.val().id, game: snap.val().game, type: snap.val().type })
            })
            setFavourite(arr)
        })

    }, [])

    useEffect(() => {
        database.ref(`/Users/${uid}/playing`).on('value', snapshot => {
            let arr = []
            snapshot?.forEach((snap) => {
                arr.push({ id: snap.val().id, game: snap.val().game, type: snap.val().type })
            })
            setPlaying(arr)
        })
    }, [])


    useEffect(() => {
        database.ref(`/Users/${uid}/suggestions`).on('value', snapshot => {
            let arr = []
            snapshot?.forEach((snap) => {
                arr.push({ id: snap.val().id, game: snap.val().game, by: snap.val().by, byuid: snap.val().byuid })
            })
            setSuggestions(arr)
        })
    }, [])

    return (

        <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
            <div className='Profile'>
                <div className='welcome' style={{ backgroundImage: favourite.length !== 0 && number ? `url(${favourite[number].game.background_image})` : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
                    <div className='welcome_backdrop'>
                        <div style={{ width: '100%' }}>
                            <div className='profile_header'>
                                <div style={{ position: 'relative', width: 'fit-content' }}>
                                    <img src={photo ? photo : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`} className='profile_image' />
                                </div>
                                <div className="profile_actions">
                                    <div className='profile_username'>{username ? username.length > 20 ? username.substring(0, 20).concat('...') : username : 'Loading...'}</div>
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
                            return <div key={data.id}>
                                <SingleGameTile data={data.game} by={data.by} byuid={data.byuid} id={data.id} />
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
    )
}
