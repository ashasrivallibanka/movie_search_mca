import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './MovieT.css';
import Card from "../../components/card/Card";

const apiKey = process.env.REACT_APP_API_KEY;

function Movies() {
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const movieName = location.state?.movieName || "";

    const fetchMovies = async () => {
        try {
            let url;

            if(movieName){
                url=`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}`;
            }
            else{
                url=`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const json = await response.json();
            const movies = json.results || [];
            setMoviesList(movies);
            filterMovies(movies);
        } catch (err) {
            setError("Failed to fetch movies: " + err.message);
            setFilteredMovies([]);
        }
    };

    const filterMovies = (movies) => {
        if (movieName) {
            const filtered = movies.filter(movie =>
                movie.original_title.toLowerCase().includes(movieName.toLowerCase())
            );
            setFilteredMovies(filtered);
            setError(filtered.length === 0 ? "No movies found matching your search." : null);
        } else {
            setFilteredMovies(movies);
            setError(null);
        }
    };

    console.log(filteredMovies)
    useEffect(() => {
        fetchMovies();
    }, [movieName, fetchMovies]);

    return (
        <>
            <h1>Movies</h1>
            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="movies-grid">
                    {filteredMovies.length > 0 ? (
                        filteredMovies.map((movie) => (
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
                        <div className="no-movie">No movies available</div>
                    )}
                </div>
            )}
        </>
    );
}

export default Movies;
