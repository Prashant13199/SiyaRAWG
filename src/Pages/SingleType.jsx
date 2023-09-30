import React, { useEffect, useState } from 'react'
import '../index.css'
import empty from '../Assets/empty.png'
import SingleGameTile from '../Components/SingleGameTile';
import { useParams } from 'react-router-dom';

export default function SingleType() {

    const [content, setContent] = useState([]);
    const { id, type, name } = useParams()

    const fetchSearch = () => {
        fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&${type}=${id}&page_size=1000`)
            .then(res => res.json()).then((data) => setContent(data.results)).catch((e) => console.log(e))
    }

    useEffect(() => {
        window.scroll(0, 0)
        fetchSearch();
    }, [id, type])

    return (
        <div className="search">
            <div className='discover_movies_title type_name'>{name}</div>
            <br />
            <div className='trending_scroll'>
                {content && content.map((data) => {
                    return <SingleGameTile data={data} key={data.id} />
                })}
            </div>
        </div>
    )
}
