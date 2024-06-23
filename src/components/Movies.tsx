import React, {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../store'
import {IState} from '../store/types/global'
import App from "./App"
import {Movie} from "../store/types/gain"
import {fetchMovies} from "../store/features/auth/moviesSlice"
import {Link} from 'react-router-dom'

function Movies(): React.JSX.Element {
    const dispatch = useAppDispatch()
    const moviesSlice: IState<Movie[]> = useAppSelector(state => state.moviesSlice)
    const [movies, setMovies] = useState<Movie[]>([])
    const [error, setError] = useState<string>("")
    const [search, setSearch] = useState<string>("")
    const [category, setCategory] = useState<string>("");

    useEffect((): void => {
        setError("")
        if (moviesSlice.response === null && !moviesSlice.isLoading) {
            dispatch(fetchMovies({_page: 0, _limit: 1_000}))
        }
        if (moviesSlice.response !== null)
            setMovies(moviesSlice.response)
        if (moviesSlice.error !== null) {
            setError(moviesSlice.error.response?.data?.exception)
        }
    }, [moviesSlice, dispatch])

    useEffect((): void => {
        if (moviesSlice.response !== null) {
            setMovies(
                moviesSlice.response.filter((m: Movie) =>
                    (
                        m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.description.toLowerCase().includes(search.toLowerCase())
                    ) && (category === "" || m.category === category)
                )
            );
        }
    }, [search, category, moviesSlice.response])
    return <>
        <App/>
        <div style={{overflow: 'hidden'}}>
            <div style={{float: 'left'}}>
                <select value={category} onChange={(val) => setCategory(val.target.value)}>
                    <option value="">Hepsi</option>
                    <option value="Film">Film</option>
                    <option value="Dizi">Dizi</option>
                    <option value="Belgesel">Belgesel</option>
                </select>
            </div>
            <div>
                <input type="search" placeholder="Film veya Dizi Ara..." value={search}
                       onChange={(val) => setSearch(val.target.value)}/>
            </div>
        </div>
        {moviesSlice.isLoading ?
            <p>Yükleniyor</p>
            :
            <>
                <div className="container">
                    {movies?.map((movie: Movie) =>
                        <div className="movie-card">
                            <div className="movie-header"
                                 style={{
                                     backgroundImage: `url(${movie.images.coverPhotos[0].url})`,
                                     backgroundPosition: 'center'
                                 }}>
                            </div>
                            <div className="movie-content">
                                <div className="movie-content-header">
                                    <Link to={"/movie"}>
                                        <h3 className="movie-title">{movie.name}</h3>
                                    </Link>
                                </div>
                                {movie.description.substring(0, 100)}...
                                <div className="movie-info">
                                    <div className="info-section">
                                        <label>Kategori</label>
                                        <span>{movie.category}</span>
                                    </div>
                                    {
                                        movie.category === "Dizi" &&
                                        <div className="info-section">
                                            <label>Sezon</label>
                                            <span>{movie.seasonCount}</span>
                                        </div>
                                    }
                                    {movie.duration !== null &&
                                        <div className="info-section">
                                            <label>Süre</label>
                                            <span>{movie.duration}</span>
                                        </div>
                                    }
                                    {movie.imdbScore !== null &&
                                        <div className="info-section">
                                            <label>Imdb</label>
                                            <span>{movie.imdbScore}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <hr/>
                {error}
            </>
        }
    </>
}

export default Movies