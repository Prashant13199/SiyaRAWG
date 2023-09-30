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

    const fetchGame = () => {
        fetch(`https://api.rawg.io/api/games/${id}?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((game) => {
                setGame(game)
                setChecked(true)
            }).catch((e) => console.log(e))

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
        fetchGame()
    }, [id])

    const render = (
        <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
            <div className='singlecontent_responsive'>
                <div className='singlecontentposter_responsive'>
                    <img alt="" src={game.background_image ? `${game.background_image}` : "https://www.movienewz.com/img/films/poster-holder.jpg"} className='singlecontentposter' />
                </div>
                <div className='details'>
                    <h2 style={{ fontWeight: 'bold' }}>{game.name}</h2>
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
                        {game.parent_platforms?.map((p) => {
                            return <img className='platform_icon_large' src={p.platform.name === 'PC' && pc || p.platform.name === 'PlayStation' && ps || p.platform.name === 'PC' && pc || p.platform.name === 'Xbox' && xbox || p.platform.name === "Nintendo" && nintendo || p.platform.name === "Apple Macintosh" && apple || p.platform.name === "Android" && android || p.platform.name === "Linux" && linux} />
                        })}
                    </div>
                    {game.vote_average !== 0 && <div className='overview'>
                        <StarIcon style={{ color: "#FFD700" }} /> {game.rating?.toFixed(2)}<span style={{ fontSize: 'small', opacity: 0.6 }}>/5</span>
                    </div>}
                    {game.tagline && (
                        <div className="tagline"><i>{game.tagline}</i></div>
                    )}
                    <div className='actions'>
                        {currentuid && <div style={{ marginRight: '20px' }}>
                            <Tooltip title="Favourite">
                                <IconButton style={{ backgroundColor: theme.palette.error.main }} >
                                    {favourite ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon style={{ color: 'white' }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Watchlist">
                                <IconButton style={{ backgroundColor: theme.palette.error.main, marginLeft: '10px' }} >
                                    {library ? <DoneIcon style={{ color: 'white' }} /> : <AddIcon style={{ color: 'white' }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Watching">
                                <IconButton style={{ backgroundColor: theme.palette.error.main, marginLeft: '10px' }} >
                                    {playing ? <PlayCircleFilledWhiteIcon style={{ color: 'white' }} /> : <PlayCircleOutlineIcon style={{ color: 'white' }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Watched">
                                <IconButton style={{ backgroundColor: theme.palette.error.main, marginLeft: '10px' }}>
                                    {played ? <FeaturedVideoIcon style={{ color: 'white' }} /> : <FeaturedVideoOutlinedIcon style={{ color: 'white' }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Share">
                                <IconButton style={{ backgroundColor: theme.palette.error.main, marginLeft: '10px' }} >
                                    <SendIcon style={{ color: 'white' }} />
                                </IconButton>
                            </Tooltip>
                        </div>}
                    </div>
                    {game?.publishers && <div className='overview'>
                        <h4>Publishers</h4>
                        <ul>
                            {game.publishers.map((pub) => {
                                return <li>{pub.name}</li>
                            })}
                        </ul>
                    </div>}

                    {game?.developers && <div className='overview'>
                        <h4>Developers</h4>
                        <ul>
                            {game.developers.map((dev) => {
                                return <li>{dev.name}</li>
                            })}
                        </ul>
                    </div>}
                    {game.description_raw && <div className='overview'>
                        <h4>Overview</h4>
                        {game.description_raw?.length > 200 && !readMore ? game.description_raw.substring(0, 200).concat('...') : game.description_raw}
                        <span className='readmore' style={{ color: theme.palette.error.main }} onClick={() => setReadMore(!readMore)}>{game.description_raw && game.description_raw?.length > 200 && (!readMore ? 'read more.' : 'Less')}</span>
                    </div>}

                </div>
            </div>
        </Grow>
    )


    return (
        <div>
            <div className='pc'>
                <div style={{ backgroundImage: `url(${game?.background_image})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
                    <div className='backdrop_opacity'>
                        {render}
                    </div>
                </div>
            </div>
            <div className='singlecontent'>
                <div className='mobile'>
                    {render}
                </div>
                <div className='pc'><br /></div>
            </div>
            {similar.length !== 0 && <>
                <div className='trending_title'>Similar</div>
                <div className='trending_scroll'>
                    {similar.map((data) => {
                        return <SingleGameTile data={data} key={data.id} />
                    })}
                </div>
                <br />
            </>}
            <div className='trending_title'>Screenshots</div>
            <div className='screenshots'>
                {screenshots?.map((pic) => {
                    return <img className='screenshot' src={pic.image} />
                })}
            </div>
        </div>
    )
}
