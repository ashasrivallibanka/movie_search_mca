import React, { useState, useEffect } from "react";
import './Popular.css';
import Card from "../../components/card/Card";

function Popular() {
    const [popularMovies, setPopularMovies] = useState([]);
    const [error, setError] = useState(null);

    const fetchPopularMovies = async () => {
        try {
            const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const json = await response.json();
            setPopularMovies(json.results || []);
        } catch (err) {
            setError("Failed to fetch popular movies: " + err.message);
            setPopularMovies([]);
        }
    };

    useEffect(() => {
        fetchPopularMovies();
    }, []);

    return (
        <>
            <h1>Popular Movies</h1>
            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="movies-grid">
                    {popularMovies.length > 0 ? (
                        popularMovies.map((movie) => (
                            <Card
                                key={movie.id}
                                image={movie.backdrop_path}
                                title={movie.original_title}
                                date={movie.release_date}
                                description={movie.overview}
                                id={movie.id}
                            />
                        ))
                    ) : (
                        <div className="no-movie">No popular movies available</div>
                    )}
                </div>
            )}
        </>
    );
}

export default Popular;
