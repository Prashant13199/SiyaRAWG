import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CircularProgress } from '@mui/material'

export default function Publisher() {

    const history = useHistory()
    const [publishers, setPublishers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPublishers = () => {
        fetch(`https://api.rawg.io/api/publishers?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((data) => {
                setPublishers(data.results)
                setLoading(false)
            }).catch((e) => console.log(e))
    }

    useEffect(() => {
        fetchPublishers()
    }, [])

    return (
        <>
            <div className='discover_movies_title'>Publishers</div>
            {!loading ? <div className='platforms'>
                {publishers?.map((platform) => {
                    return <div onClick={() => history.push(`/singletype/${platform.id}/publishers/${platform.name}`)} className='single_platform' style={{ backgroundImage: `url(${platform.image_background})` }}><div className='single_platform_content'>{platform.name}</div></div>
                })}
            </div> : <div className='loading'><CircularProgress color='error' /></div>}
        </>
    )
}
