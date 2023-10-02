import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import Tooltip from '@mui/material/Tooltip';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StarIcon from '@mui/icons-material/Star';
import Grow from '@mui/material/Grow';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import FeaturedVideoOutlinedIcon from '@mui/icons-material/FeaturedVideoOutlined';
import xbox from '../Assets/xbox.png'
import ps from '../Assets/ps.png'
import pc from '../Assets/pc.png'
import nintendo from '../Assets/nintendo.png'
import apple from '../Assets/apple.png'
import android from '../Assets/android.png'
import linux from '../Assets/linux.png'
import '../index.css'
import SingleGameTile from '../Components/SingleGameTile';
import { database } from '../firebase';
import { Modal } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function SingleContent() {

    const { id } = useParams()
    const theme = useTheme()
    const currentuid = localStorage.getItem('uid')

    const [readMore, setReadMore] = useState(false)
    const [checked, setChecked] = useState(false);
    const [users, setUsers] = useState([])
    const [game, setGame] = useState('')
    const [snackBar, setSnackBar] = useState(false)
    const [screenshots, setScreenshots] = useState([])
    const [favourite, setFavourite] = useState(false)
    const [library, setLibrary] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [played, setPlayed] = useState(false)
    const [similar, setSimilar] = useState([])
    const [currentusername, setCurrentusername] = useState('')
    const [name, setName] = useState('')

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    useEffect(() => {

        setChecked(true)

        database.ref(`/Users/${currentuid}`).on('value', snapshot => {
            setCurrentusername(snapshot.val()?.username)
        })

        database.ref(`/Users/${currentuid}/favourites/${id}`).on('value', snapshot => {
            if (snapshot.val()?.id === id) {
                setFavourite(true)
            } else {
                setFavourite(false)
            }
        })

        database.ref(`/Users/${currentuid}/library/${id}`).on('value', snapshot => {
            if (snapshot.val()?.id === id) {
                setLibrary(true)
            } else {
                setLibrary(false)
            }
        })

        database.ref(`/Users/${currentuid}/played/${id}`).on('value', snapshot => {
            if (snapshot.val()?.id === id) {
                setPlayed(true)
            } else {
                setPlayed(false)
            }
        })

        database.ref(`/Users/${currentuid}/playing/${id}`).on('value', snapshot => {
            if (snapshot.val()?.id === id) {
                setPlaying(true)
            } else {
                setPlaying(false)
            }
        })

        database.ref(`/Users`).on('value', snapshot => {
            let user = []
            snapshot.forEach((snap) => {
                if (snap.key !== currentuid) {
                    user.push(snap.val())
                }
            })
            setUsers(user)
        })

    }, [id])

    const fetchGame = () => {
        fetch(`https://api.rawg.io/api/games/${id}?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((game) => setGame(game)).catch((e) => console.log(e))

        fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((photo) => {
                setScreenshots(photo.results)
            }).catch((e) => console.log(e))

        fetch(`https://api.rawg.io/api/games/${id}/game-series?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((data) => {
                setSimilar(data.results)
            }).catch((e) => console.log(e))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchGame()
    }, [id])

    const handleFavourite = () => {
        if (!favourite) {
            database.ref(`/Users/${currentuid}/favourites/${id}`).set({
                id: id, game: game
            }).then(() => {
                setFavourite(true)
            })
        } else {
            database.ref(`/Users/${currentuid}/favourites/${id}`).remove().then(() => {
                setFavourite(false)
            })
        }
    }

    const handleLibrary = () => {
        if (!library) {
            database.ref(`/Users/${currentuid}/library/${id}`).set({
                id: id, game: game
            }).then(() => {
                setLibrary(true)
            })
        } else {
            database.ref(`/Users/${currentuid}/library/${id}`).remove().then(() => {
                setLibrary(false)
            })
        }
    }

    const handlePlayed = () => {
        if (!played) {
            database.ref(`/Users/${currentuid}/played/${id}`).set({
                id: id, game: game
            }).then(() => {
                setPlayed(true)
            })
        } else {
            database.ref(`/Users/${currentuid}/played/${id}`).remove().then(() => {
                setPlayed(false)
            })
        }
    }

    const handlePlaying = () => {
        if (!playing) {
            database.ref(`/Users/${currentuid}/playing/${id}`).set({
                id: id, game: game
            }).then(() => {
                setPlaying(true)
            })
        } else {
            database.ref(`/Users/${currentuid}/playing/${id}`).remove().then(() => {
                setPlaying(false)
            })
        }
    }

    const handleSend = (user) => {
        database.ref(`/Users/${user}/suggestions/${id}`).update({
            id: id, game: game, by: currentusername, byuid: currentuid
        }).then(() => {
            handleClose2()
            setSnackBar(true)
        }).catch((e) => { console.log(e) })
    }

    const render = (
        <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
            <div className='singlecontent_responsive'>
                <div className='details'>
                    <h1 className='pc' style={{ fontWeight: 'bold' }}>{game.name}</h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(game.release_date || game.first_air_date) && <>{game.release_date || game.first_air_date}{(game.release_date || game.first_air_date) && game.runtime && <>&nbsp;&#183;&nbsp;</>}</>}{game.runtime && game.runtime !== 0 && <>{Math.ceil(game.runtime / 60)}h</>}
                    </div>
                    {game.released && <div className='overview released'>
                        {game?.released}
                    </div>}
                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '10px 0px' }}>
                        {game.genres && game.genres.map((g) => { return <div key={g.id} className='genrelist'>{g.name}</div> })}
                    </div>
                    <div className='single_game_scroll_platforms'>
                        {game.parent_platforms?.map((p, index) => {
                            return <img key={index} className='platform_icon_large' src={p.platform.name === 'PC' && pc || p.platform.name === 'PlayStation' && ps || p.platform.name === 'PC' && pc || p.platform.name === 'Xbox' && xbox || p.platform.name === "Nintendo" && nintendo || p.platform.name === "Apple Macintosh" && apple || p.platform.name === "Android" && android || p.platform.name === "Linux" && linux} />
                        })}
                    </div>
                    {game.vote_average !== 0 && <div className='overview'>
                        <StarIcon style={{ color: "#FFD700" }} /> {game.rating?.toFixed(2)}<span style={{ fontSize: 'small', opacity: 0.6 }}>/5</span>
                    </div>}

                    <div className='actions'>
                        {currentuid && <div style={{ marginRight: '20px' }}>
                            <Tooltip title="Favourite">
                                <IconButton style={{ backgroundColor: theme.palette.info.main }} onClick={() => handleFavourite()}>
                                    {favourite ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon style={{ color: 'white' }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Library">
                                <IconButton style={{ backgroundColor: theme.palette.info.main, marginLeft: '10px' }} onClick={() => handleLibrary()}>
                                    {library ? <DoneIcon style={{ color: 'white' }} /> : <AddIcon style={{ color: 'white' }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Playing">
                                <IconButton style={{ backgroundColor: theme.palette.info.main, marginLeft: '10px' }} onClick={() => handlePlaying()}>
                                    {playing ? <PlayCircleFilledWhiteIcon style={{ color: 'white' }} /> : <PlayCircleOutlineIcon style={{ color: 'white' }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Played">
                                <IconButton style={{ backgroundColor: theme.palette.info.main, marginLeft: '10px' }} onClick={() => handlePlayed()}>
                                    {played ? <FeaturedVideoIcon style={{ color: 'white' }} /> : <FeaturedVideoOutlinedIcon style={{ color: 'white' }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Share" onClick={() => handleShow2()}>
                                <IconButton style={{ backgroundColor: theme.palette.info.main, marginLeft: '10px' }} >
                                    <SendIcon style={{ color: 'white' }} />
                                </IconButton>
                            </Tooltip>
                        </div>}
                    </div>

                    {game?.publishers?.length !== 0 && <div className='overview'>
                        <h4>Publishers</h4>
                        <ul>
                            {game.publishers?.map((pub) => {
                                return <li key={pub.id}>{pub.name}</li>
                            })}
                        </ul>
                    </div>}

                    {game?.developers?.length !== 0 && <div className='overview'>
                        <h4>Developers</h4>
                        <ul>
                            {game.developers?.map((dev) => {
                                return <li key={dev.id}>{dev.name}</li>
                            })}
                        </ul>
                    </div>}
                    {game.description_raw && <div className='overview'>
                        <h4>Overview</h4>
                        {game.description_raw?.length > 200 && !readMore ? game.description_raw.substring(0, 200).concat('...') : game.description_raw}
                        <span className='readmore' style={{ color: theme.palette.info.main }} onClick={() => setReadMore(!readMore)}>{game.description_raw && game.description_raw?.length > 200 && (!readMore ? 'read more.' : 'Less')}</span>
                    </div>}

                </div>
            </div>
        </Grow>
    )


    return (
        <>
            <Modal show={show2} onHide={handleClose2} centered>
                <Modal.Body style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
                    <IconButton onClick={() => handleClose2()} style={{ position: 'absolute', top: 0, right: 0 }}><CloseIcon style={{ color: 'red' }} /></IconButton>
                    <h2>Share To</h2>
                    <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                        {users && users.map((user) => {
                            return <div key={user.uid} className='share_user' onClick={() => {
                                handleSend(user.uid)
                                setName(user.username)
                            }
                            }>
                                <div>
                                    <img src={user.photo} className="share_user_image" />
                                </div>
                                <div className='share_user_username'>
                                    {user.username.length > 25 ? user.username.substring(0, 25).concat('...') : user.username}
                                </div>
                            </div>
                        })}
                    </div>
                </Modal.Body>
            </Modal>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={snackBar}
                onClose={() => setSnackBar(false)}
                autoHideDuration={2000}
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => setSnackBar(false)}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>}
            ><Alert onClose={() => {
                handleClose2()
                setName('')
            }
            } severity="success" sx={{ width: '100%' }}>
                    Suggested to {name && name.length > 12 ? name.substring(0, 12).concat('...') : name}!
                </Alert></Snackbar>
            <div>
                <div className='pc'>
                    <div style={{ backgroundImage: game?.background_image ? `url(${game?.background_image})` : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
                        <div className='backdrop_opacity'>
                            {render}
                        </div>
                    </div>
                </div>
                <div className='singlecontent'>
                    <div className='mobile'>
                        <div style={{ backgroundImage: game?.background_image ? `url(${game?.background_image})` : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
                            <div className='welcome_backdrop'>
                                <div className='welcomeText'>{game?.name ? game?.name : 'Loading...'}</div>
                            </div>
                        </div>
                        {render}
                    </div>
                    <div className='pc'><br /></div>
                </div>
                {similar?.length !== 0 && <>
                    <div className='trending_title'>Similar</div>
                    <div className='trending_scroll'>
                        {similar.map((data) => {
                            return <SingleGameTile data={data} key={data.id} />
                        })}
                    </div>
                    <br />
                </>}
                {screenshots?.length !== 0 && <><div className='trending_title'>Screenshots</div>
                    <div className='screenshots'>
                        {screenshots?.map((pic, index) => {
                            return <img key={index} className='screenshot' src={pic.image} />
                        })}
                    </div></>}
            </div>
        </>
    )
}
