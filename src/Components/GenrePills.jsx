import React, { useEffect } from 'react'
import '../index.css'
import Chip from '@mui/material/Chip';

export default function GenrePills({
    selectedGenres,
    setSelectedGenres,
    genres,
    setGenres,
    setPage,
}) {

    const handleAdd = (genre) => {
        setSelectedGenres([...selectedGenres, genre]);
        setGenres(genres.filter((g) => g.id !== genre.id));
        setPage(1);
    };

    const handleRemove = (genre) => {
        setSelectedGenres(
            selectedGenres.filter((selected) => selected.id !== genre.id)
        );
        setGenres([...genres, genre]);
        setPage(1);
    };

    const fetchGenres = () => {
        fetch(`https://api.rawg.io/api/genres?key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json()).then((data) => {
                setGenres(data.results)
            }).catch((e) => console.log(e))
    }

    useEffect(() => {
        fetchGenres();
        return () => {
            setGenres({});
        };
    }, []);

    return (
        <div style={{ margin: '20px 0px' }}>
            {selectedGenres?.map((genre) => (
                <Chip
                    style={{ margin: 2, padding: 4 }}
                    label={genre.name}
                    key={genre.id}
                    clickable
                    color='primary'
                    size="small"
                    onDelete={() => handleRemove(genre)}
                />
            ))}
            {genres?.map((genre) => (
                <Chip
                    style={{ margin: 2, padding: 4 }}
                    label={genre.name}
                    key={genre.id}
                    clickable
                    size="small"
                    color='error'
                    onClick={() => handleAdd(genre)}
                />
            ))}
        </div>
    )
}
