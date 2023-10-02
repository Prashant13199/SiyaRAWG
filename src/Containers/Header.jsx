import React, { useEffect, useState } from 'react';
import '../index.css'
import { Link } from 'react-router-dom'
import xbox from '../Assets/xbox.png'
import ps from '../Assets/ps.png'
import pc from '../Assets/pc.png'
import nintendo from '../Assets/nintendo.png'
import apple from '../Assets/apple.png'
import android from '../Assets/android.png'
import linux from '../Assets/linux.png'

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
            <div className='single_game_scroll_platforms'>
              {upcoming[number]?.parent_platforms?.map((p, index) => {
                return <img key={index} className='platform_icon_large' src={p.platform.name === 'PC' ? pc : '' || p.platform.name === 'PlayStation' ? ps : '' || p.platform.name === 'PC' ? pc : '' || p.platform.name === 'Xbox' ? xbox : '' || p.platform.name === "Nintendo" ? nintendo : '' || p.platform.name === "Apple Macintosh" ? apple : '' || p.platform.name === "Android" ? android : '' || p.platform.name === "Linux" ? linux : ''} />
              })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
