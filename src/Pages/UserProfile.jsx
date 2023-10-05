import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import '../index.css';
import { useParams } from 'react-router-dom';
import empty from '../Assets/empty.png'
import SingleGameTile from '../Components/SingleGameTile';

export default function UserProfile() {

    const { uid } = useParams()
    const [username, setUsername] = useState('')
    const [photo, setPhoto] = useState('')
    const [library, setLibrary] = useState([])
    const [played, setPlayed] = useState([])
    const [favourite, setFavourite] = useState([])
    const [playing, setPlaying] = useState([])
    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        database.ref(`/Users/${uid}`).on('value', snapshot => {
            setPhoto(snapshot.val()?.photo)
            setUsername(snapshot.val()?.username)
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
        <div className='Profile'>
            <div className='profile_header'>
                <div style={{ position: 'relative', width: 'fit-content' }}>
                    <img src={photo ? photo : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`} className='profile_image' />
                </div>
                <div className="profile_actions">
                    <div className='profile_username'>{username ? username.length > 20 ? username.substring(0, 20).concat('...') : username : 'Loading...'}</div>
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
                        return <div key={data.id}>
                            <SingleGameTile data={data.game} by={data.by} byuid={data.byuid} id={data.id} />
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
                <h6>Nothing to show</h6></center>}
        </div>
    )
}
