import React, { useEffect, useState } from 'react';
import '../index.css'
import { Link } from 'react-router-dom'

export default function Header() {

  const [upcoming, setUpcoming] = useState([])
  const [number, setNumber] = useState(null)

  const fetchUpcoming = async () => {
    fetch(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}`).then(res => res.json()).then((data) => setUpcoming(data.results)).catch((e) => console.log(e))
  };

  useEffect(() => {
    fetchUpcoming();
  }, [])

  useEffect(() => {
    setNumber(Math.floor(Math.random() * upcoming.length))
  }, [upcoming])

  return (
    <Link to={`/game/${upcoming[number]?.id}`} style={{ textDecoration: 'none' }}>
      <div className='welcome' style={{ backgroundImage: upcoming.length !== 0 && number ? `url(${upcoming[number].background_image})` : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '10px' }}>
        <div className='welcome_backdrop'>
          <div style={{ width: '100%' }}>
            <div className='welcomeText'>{upcoming[number]?.name ? upcoming[number]?.name : 'Loading...'}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
