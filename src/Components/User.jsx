import React, { useEffect } from 'react'
import '../index.css'
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function User({ user }) {

    useEffect(() => {
        AOS.init({ duration: 800 })
    }, [])

    return (
        <Grid xs={2} sm={4} md={4} key={user.uid} data-aos="zoom-in">
            <Link to={`/user/${user.uid}`} style={{ textDecoration: 'none' }}>
                <div className='User' style={{ backgroundImage: user?.photo ? `url(${user?.photo})` : `url(https://api.dicebear.com/6.x/thumbs/png?seed=Spooky)` }}>
                    <div className='user_username'>
                        {user?.username}
                    </div>
                </div>
            </Link>
        </Grid>
    )
}
