import React, { useEffect, useState } from 'react'
import SingleGameTile from '../Components/SingleGameTile'
import '../index.css'
import { Button, CircularProgress, IconButton } from '@mui/material'
import { Modal } from 'react-bootstrap';
import { useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import empty from '../Assets/empty.png'
import CustomPagination from '../Components/CustomPagination';

export default function Home({ setBackground, scrollTop }) {

    const [content, setContent] = useState([])
    const [platforms, setPlatforms] = useState([])
    const [publishers, setPublishers] = useState([])
    const [genres, setGenres] = useState([])
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(1)
    const [numOfPages, setNumOfPages] = useState();

    const theme = useTheme()

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [type, setType] = useState('Trending')
    const [platform, setPlatform] = useState('')
    const [publisher, setPublisher] = useState('')
    const [genre, setGenre] = useState('')

    useEffect(() => {
        setBackground('')
        setLoading(true)
        fetchGames()
        fetchPlatforms()
        fetchPublishers()
        fetchGenres()
    }, [])

    useEffect(() => {
        setNumOfPages(0)
        setLoading(true)
        fetchGames()
        scrollTop()
    }, [type, platform, publisher, genre])

    useEffect(() => {
        setLoading(true)
        fetchGames()
        scrollTop()
    }, [page])

    const getCurrentMonth = function () {
        const month = new Date().getMonth() + 1;
        if (month < 10) {
            return `0${month}`;
        } else {
            return month;
        }
    };

    const fetchGames = () => {
        if (type === 'Trending') {
            fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&ordering=-rating&${publisher && `publishers=${publisher}`}&${platform && `platforms=${platform}`}&${genre && `genres=${genre}`}&page=${page}`)
                .then(res => res.json()).then((data) => {
                    setContent(data.results)
                    setLoading(false)
                    setNumOfPages(Math.floor(data?.count / data.results?.length))
                }).catch((e) => console.log(e))
        } else if (type === 'Upcoming') {
            fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&dates=${currentDate},${nextYear}&ordering=-added${publisher && `publishers=${publisher}`}&${platform && `platforms=${platform}`}&${genre && `genres=${genre}`}&page=${page}`)
                .then(res => res.json()).then((data) => {
                    setContent(data.results)
                    setLoading(false)
                    setNumOfPages(Math.floor(data?.count / data.results?.length))
                }).catch((e) => console.log(e))
        } else if (type === 'Popular') {
            fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&dates=${lastYear},${currentDate}&ordering=-rating${publisher && `publishers=${publisher}`}&${platform && `platforms=${platform}`}&${genre && `genres=${genre}`}&page=${page}`)
                .then(res => res.json()).then((data) => {
                    setContent(data.results)
                    setLoading(false)
                    setNumOfPages(Math.floor(data?.count / data.results?.length))
                }).catch((e) => console.log(e))
        } else if (type === 'New') {
            fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&dates=${lastYear},${currentDate}&ordering=-released${publisher && `publishers=${publisher}`}&${platform && `platforms=${platform}`}&${genre && `genres=${genre}`}&page=${page}`)
                .then(res => res.json()).then((data) => {
                    setContent(data.results)
                    setLoading(false)
                    setNumOfPages(Math.floor(data?.count / data.results?.length))
                }).catch((e) => console.log(e))
        }

    }

    const fetchPlatforms = () => {
        fetch(`https://api.rawg.io/api/platforms?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((data) => {
                setPlatforms(data.results)
            }).catch((e) => console.log(e))
    }

    const fetchPublishers = () => {
        fetch(`https://api.rawg.io/api/publishers?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((data) => {
                setPublishers(data.results)
            }).catch((e) => console.log(e))
    }

    const fetchGenres = () => {
        fetch(`https://api.rawg.io/api/genres?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((data) => {
                setGenres(data.results)
            }).catch((e) => console.log(e))
    }

    const getCurrentDay = function () {
        const day = new Date().getDate();
        if (day < 10) {
            return `0${day}`;
        } else {
            return day;
        }
    };
    const currentYear = new Date().getFullYear();
    const currentMonth = getCurrentMonth();
    const currentDay = getCurrentDay();
    const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
    const lastYear = `${currentYear - 1}-${currentMonth}-${currentDay}`;
    const nextYear = `${currentYear + 1}-${currentMonth}-${currentDay}`;

    const handleReset = () => {
        setType('Trending')
        setGenre('')
        setPlatform('')
        setPublisher('')
        handleClose()
    }

    return (
        <>

            <Modal show={show} onHide={handleClose} centered size="md">
                <Modal.Body className='trailer' style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, height: '100%' }}>
                    <IconButton onClick={() => handleClose()} style={{ position: 'absolute', top: 0, right: 0 }}><CloseIcon style={{ color: 'red' }} /></IconButton>
                    <div className='modal_content'>
                        <h1>Filters</h1>
                        <br />
                        <div className='modal_dropdowns' >
                            <select onChange={(e) => setType(e.target.value)} className='select' defaultValue={type}>
                                <option value={'Trending'}>Trending</option>
                                <option value={'Upcoming'}>Upcoming</option>
                                <option value={'Popular'}>Popular</option>
                                <option value={'New'}>New</option>
                            </select>
                            <select onChange={(e) => setPlatform(e.target.value)} className='select' defaultValue={platform}>
                                <option value={''}>Select Platform</option>
                                {platforms?.map((platform) => {
                                    return <option value={platform.id}>{platform.name}</option>
                                })}
                            </select>
                            <select onChange={(e) => setPublisher(e.target.value)} className='select' defaultValue={publisher}>
                                <option value={''}>Select Publisher</option>
                                {publishers?.map((publisher) => {
                                    return <option value={publisher.id}>{publisher.name}</option>
                                })}
                            </select>
                            <select onChange={(e) => setGenre(e.target.value)} className='select' defaultValue={genre}>
                                <option value={''}>Select Genre</option>
                                {genres?.map((genre) => {
                                    return <option value={genre.id}>{genre.name}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <Button variant='contained' color="success" onClick={() => handleReset()}>Reset</Button>
                </Modal.Body>
            </Modal>
            <div className='Home'>
                <div className='page_header_text'>{type} <IconButton onClick={() => handleShow()}><FilterAltIcon className='filter_icon' /></IconButton></div>
                {!loading ? <div className='home_grid'>
                    {content?.map((data) => {
                        return <SingleGameTile data={data} key={data.id} />
                    })}
                </div> : <div className='loading'><CircularProgress color='success' /></div>}
                {numOfPages > 1 && (
                    <CustomPagination setPage={setPage} numOfPages={numOfPages} />
                )}
                {content?.length === 0 && !loading && <center><br />
                    <img src={empty} width={'100px'} height={'auto'} />
                    <h6>Nothing to show</h6></center>}
            </div>
        </>
    )
}
