import React, { useEffect, useState } from 'react'
import '../index.css'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import empty from '../Assets/empty.png'
import { useTheme } from '@mui/material';
import SingleGameTile from '../Components/SingleGameTile';

export default function Search() {

    const [content, setContent] = useState([]);
    const theme = useTheme()
    const [query, setQuery] = useState("")

    const fetchSearch = () => {
        fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&search=${query}`)
            .then(res => res.json()).then((data) => setContent(data.results)).catch((e) => console.log(e))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchSearch();
    }, [query])

    return (
        <div className="search">
            <div className='discover_movies_title'>Search</div>
            <Paper component="form" sx={{ p: '4px 4px', display: 'flex', alignItems: 'center', width: '98%', borderRadius: '20px', margin: 'auto' }}>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    className='input_search'
                    placeholder="Search games"
                    value={query}
                    autoFocus
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            e.preventDefault()
                        }
                    }}
                />
            </Paper>
            <br />
            <div className='trending_scroll_responsive'>
                {content && content.map((data) => {
                    return <SingleGameTile data={data} key={data.id} />
                })}
            </div>
            {content?.length === 0 && query && <center>
                <img src={empty} width={'100px'} height={'auto'} />
                <h6>Oops... no games found</h6></center>}
        </div>
    )
}
