import React from 'react'
import '../index.css'
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2';

export default function User({ user }) {

    return (
        <Grid xs={2} sm={4} md={4} key={user.uid}>
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
