import React from 'react'
import '../index.css'
import xbox from '../Assets/xbox.png'
import ps from '../Assets/ps.png'
import pc from '../Assets/pc.png'
import nintendo from '../Assets/nintendo.png'
import apple from '../Assets/apple.png'
import android from '../Assets/android.png'
import linux from '../Assets/linux.png'
import { useHistory } from 'react-router-dom'
import { database, auth } from '../firebase'
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material'
import { Link } from 'react-router-dom';

export default function SingleGameTile({ data, by, byuid, id }) {

    const history = useHistory()
    const theme = useTheme()

    const removeSuggestion = () => {
        if (id) {
            database.ref(`/Users/${auth?.currentUser?.uid}/suggestions/${id}`).remove().then(() => {
                console.log('Suggestion Removed')
            }).catch((e) => console.log(e))
        }
    }

    return (
        <>
            <div className='single_game_tile' onClick={() => history.push(`/game/${data.id}`)}>
                <img
                    src={data?.background_image ? data?.background_image : "https://www.movienewz.com/img/films/poster-holder.jpg"}
                    alt={data?.name}
                    className="single_game_tile_poster"
                />
                <div className='single_game_tile_content'>
                    <div className='single_game_tile_content_top'>
                        <div className='single_game_scroll_platforms'>
                            {data?.parent_platforms?.map((p, index) => {
                                return <img key={index} className='platform_icon_small' src={p.platform.name === 'PC' ? pc : '' || p.platform.name === 'PlayStation' ? ps : '' || p.platform.name === 'PC' ? pc : '' || p.platform.name === 'Xbox' ? xbox : '' || p.platform.name === "Nintendo" ? nintendo : '' || p.platform.name === "Apple Macintosh" ? apple : '' || p.platform.name === "Android" ? android : '' || p.platform.name === "Linux" ? linux : ''} />
                            })}
                        </div>
                        {data?.rating !== 0 ? <div className='rating' style={{ borderColor: data?.rating > 3 ? 'green' : 'yellow', color: data?.rating > 3 ? 'lightgreen' : 'lightyellow' }}>{data?.rating}</div> : <div></div>}
                    </div>
                    <div className='single_game_tile_title'>
                        {data?.name}
                    </div>
                </div>
            </div>
            {by && <div className='user'>
                <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => removeSuggestion()} />
                <Link style={{ color: theme.palette.text.primary, textDecoration: 'none' }} to={`/user/${byuid}`}>{by}</Link>
            </div>}
        </>
    )
}
