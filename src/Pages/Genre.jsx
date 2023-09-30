import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

export default function Genre() {

    const history = useHistory()
    const [genres, setGenres] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchGenres = () => {
        fetch(`https://api.rawg.io/api/genres?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((data) => {
                setGenres(data.results)
                setLoading(false)
            }).catch((e) => console.log(e))
    }

    useEffect(() => {
        fetchGenres()
    }, [])

    return (
        <>
            <div className='discover_movies_title'>Genres</div>
            {!loading ? <div className='platforms'>
                {genres?.map((platform) => {
                    return <div onClick={() => history.push(`/singletype/${platform.id}/genres/${platform.name}`)} className='single_platform' style={{ backgroundImage: `url(${platform.image_background})` }}><div className='single_platform_content'>{platform.name}</div></div>
                })}
            </div> : <div className='loading'><CircularProgress color='error' /></div>}
        </>
    )
}
