import React, { useEffect, useState } from 'react'
import '../index.css'
import SingleGameTile from '../Components/SingleGameTile';
import { useParams } from 'react-router-dom';
import CustomPagination from '../Components/CustomPagination';
import GenrePills from '../Components/GenrePills';
import useGenre from '../Services/useGenre';
import { CircularProgress } from '@mui/material';

export default function SingleType() {

    const [content, setContent] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const { id, type, name } = useParams()
    const [page, setPage] = useState(1);
    const [numOfPages, setNumOfPages] = useState();
    const genreforURL = useGenre(selectedGenres);
    const [loading, setLoading] = useState(true)

    const fetchSearch = () => {
        fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&${type}=${id}&page=${page}${genreforURL && `&genres=${genreforURL}`}`)
            .then(res => res.json()).then((data) => {
                setContent(data?.results)
                setNumOfPages(Math.floor(data?.count / data.results?.length))
                setLoading(false)
            }).catch((e) => console.log(e))
    }

    useEffect(() => {
        fetchSearch();
        window.scrollTo(0, 0)
        setLoading(true)
    }, [id, type, page, genreforURL])

    return (
        <div className="search">
            <div className='discover_movies_title type_name'>{name}</div>
            <GenrePills
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                genres={genres}
                setGenres={setGenres}
                setPage={setPage}
            />
            {!loading ? <><div className='trending_scroll_responsive'>
                {content && content.map((data) => {
                    return <SingleGameTile data={data} key={data.id} />
                })}
            </div>
            </> : < div className='loading'><CircularProgress color="info" /></div>}
            <br />
            {numOfPages > 1 && (
                <CustomPagination setPage={setPage} numOfPages={numOfPages} />
            )}
        </div>
    )
}
