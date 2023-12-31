import React, { useEffect, useState } from 'react'
import '../index.css'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import empty from '../Assets/empty.png'
import SingleGameTile from '../Components/SingleGameTile';
import { CircularProgress } from '@mui/material'

export default function Search({ setBackground }) {

    const [content, setContent] = useState([]);
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setBackground('')
    }, [])

    const fetchSearch = () => {
        setLoading(true)
        fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&search=${query}`)
            .then(res => res.json())
            .then((data) => {
                setContent(data.results)
                setLoading(false)
            }).catch((e) => console.log(e))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchSearch();
    }, [query])

    return (
        <div className='Profile'>
            <div className='page_header_text'>Search</div>
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
            {!loading ? <div className='trending_scroll_responsive'>
                {content?.map((data) => {
                    return <SingleGameTile data={data} key={data.id} />
                })}
            </div> : <div className='loading'><CircularProgress color='success' /></div>}
            {content?.length === 0 && query && <center>
                <img src={empty} width={'100px'} height={'auto'} />
                <h6>Oops... no games found</h6></center>}
        </div>
    )
}
