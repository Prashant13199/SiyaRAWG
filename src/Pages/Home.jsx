import React, { useEffect, useState } from 'react'
import SingleGameTile from '../Components/SingleGameTile'
import '../index.css'
import Header from '../Containers/Header'
import Grow from '@mui/material/Grow';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {

    useEffect(() => {
        AOS.init({ duration: 800 })
    }, [])

    const [trending, setTrending] = useState([])
    const [popular, setpopular] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [newgames, setNewgames] = useState([])
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        fetchTrending()
        fetchPopular()
        fetchUpcoming()
        fetchNewgames()
    }, [])

    const fetchTrending = () => {
        fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&ordering=-rating&page_size=1000`)
            .then(res => res.json()).then((data) => setTrending(data.results)).catch((e) => console.log(e))
    }

    const fetchPopular = () => {
        fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&dates=${lastYear},${currentDate}&ordering=-rating&page_size=1000`)
            .then(res => res.json()).then((data) => setpopular(data.results)).catch((e) => console.log(e))
    }

    const fetchUpcoming = () => {
        fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&dates=${currentDate},${nextYear}&ordering=-added&page_size=1000`)
            .then(res => res.json()).then((data) => setUpcoming(data.results)).catch((e) => console.log(e))
    }

    const fetchNewgames = () => {
        fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&dates=${lastYear},${currentDate}&ordering=-released&page_size=1000`)
            .then(res => res.json()).then((data) => {
                setNewgames(data.results)
                setChecked(true)
            }).catch((e) => console.log(e))
    }

    const getCurrentMonth = function () {
        const month = new Date().getMonth() + 1;
        if (month < 10) {
            return `0${month}`;
        } else {
            return month;
        }
    };
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

    return (
        <Grow in={checked} {...(checked ? { timeout: 1000 } : {})} style={{ transformOrigin: '0 0 0' }}>
            <div>
                <Header />
                <br />
                {upcoming?.length !== 0 && <>
                    <div className='trending_title' data-aos="fade-right">Upcoming</div>
                    <div className='trending_scroll' data-aos="fade-left">
                        {upcoming.map((data) => {
                            return <SingleGameTile data={data} key={data.id} />
                        })}
                    </div>
                    <br />
                </>}
                {trending.length !== 0 && <><div className='trending_title' data-aos="fade-right">Trending</div>
                    <div className='trending_scroll' data-aos="fade-left">
                        {trending.map((data) => {
                            return <SingleGameTile data={data} key={data.id} />
                        })}
                    </div>
                    <br />
                </>}
                {popular.length !== 0 && <>
                    <div className='trending_title' data-aos="fade-right">Popular</div>
                    <div className='trending_scroll' data-aos="fade-left">
                        {popular.map((data) => {
                            return <SingleGameTile data={data} key={data.id} />
                        })}
                    </div>
                    <br />
                </>}
                {newgames.length !== 0 && <>
                    <div className='trending_title' data-aos="fade-right">New</div>
                    <div className='trending_scroll' data-aos="fade-left">
                        {newgames.map((data) => {
                            return <SingleGameTile data={data} key={data.id} />
                        })}
                    </div>
                </>}
            </div>
        </Grow>

    )
}
