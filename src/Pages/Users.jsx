import React, { useEffect, useState } from 'react'
import '../index.css'
import { database } from '../firebase'
import User from '../Components/User';
import Grid from '@mui/material/Unstable_Grid2';
import { CircularProgress } from '@mui/material';

export default function Users() {

    const [users, setUsers] = useState([])
    const currentuid = localStorage.getItem('uid')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchUsers()
    }, [])

    const fetchUsers = () => {
        database.ref(`/Users`).orderByChild('createdAccountOn').on('value', snapshot => {
            let user = []
            snapshot.forEach((snap) => {
                if (snap.val().uid !== currentuid)
                    user.push({ data: snap.val() })
            })
            setUsers(user)
            setLoading(false)
        })
    }

    return !loading ? (
        <div className='people'>
            <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 12, md: 20 }}>
                {users && users.map((user) => {
                    return <User user={user.data} key={user.data.uid} />
                })}
            </Grid>
        </div>
    )
        : <div className="loading">
            <CircularProgress color='error' />
        </div>
}
