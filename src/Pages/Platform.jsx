import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

export default function Platform() {

    const history = useHistory()
    const [platforms, setPlatforms] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPlatforms = () => {
        fetch(`https://api.rawg.io/api/platforms?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((data) => {
                setPlatforms(data.results)
                setLoading(false)
            }).catch((e) => console.log(e))
    }

    useEffect(() => {
        fetchPlatforms()
    }, [])

    return (
        <>
            <div className='discover_movies_title'>Platforms</div>
            {!loading ? <div className='platforms'>
                {platforms?.map((platform) => {
                    return <div key={platform.id} onClick={() => history.push(`/singletype/${platform.id}/platforms/${platform.name}`)} className='single_platform' style={{ backgroundImage: `url(${platform.image_background})` }}><div className='single_platform_content'>{platform.name}</div></div>
                })}
            </div> : <div className='loading'><CircularProgress color='error' /></div>}
        </>
    )
}
