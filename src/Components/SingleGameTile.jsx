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

export default function SingleGameTile({ data }) {

    const history = useHistory()

    return (

        <div className='single_game_tile' onClick={() => history.push(`/game/${data.id}`)}>
            <img
                src={data?.background_image}
                alt={data?.name}
                className="single_game_tile_poster"
            />
            <div className='single_game_tile_content'>
                <div className='single_game_scroll_platforms'>
                    {data.parent_platforms?.map((p) => {
                        return <img className='platform_icon_small' src={p.platform.name === 'PC' && pc || p.platform.name === 'PlayStation' && ps || p.platform.name === 'PC' && pc || p.platform.name === 'Xbox' && xbox || p.platform.name === "Nintendo" && nintendo || p.platform.name === "Apple Macintosh" && apple || p.platform.name === "Android" && android || p.platform.name === "Linux" && linux} />
                    })}
                </div>
                <div className='single_game_tile_content_bottom'>
                    <div className='single_game_tile_title'>
                        {data.name}
                    </div>
                    {data.rating !== 0 ? <div className='rating'>{data.rating}</div> : <div></div>}
                </div>

            </div>
        </div>

    )
}
