import React, { useState } from "react";
import MovieCard from "./components/MovieCard";
import "./App.css";

const API_KEY = "baf42048";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");

  const search = async (term) => {
    if (!term) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://omdbapi.com/?s=${encodeURIComponent(term)}&apikey=${API_KEY}`
      );
      const data = await res.json();
      setMovies(Array.isArray(data?.Search) ? data.Search.slice(0, 12) : []);
    } catch (err) {
      console.error(err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const onSearchClick = () => {
    search(query.trim());
  };

  const onSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    if (!val) return;

    const toYear = (y) => {
      const n = parseInt(y, 10);
      return Number.isFinite(n) ? n : -Infinity;
    };

    const sorted = [...movies].sort((a, b) => {
      if (val === "newest") return toYear(b.Year) - toYear(a.Year);
      return toYear(a.Year) - toYear(b.Year);
    });
    setMovies(sorted);
  };

  return (
    <div className="app">
      <nav className="nav__container">
        <img className="logo" src="/assets/movie-icon.png" alt="Logo" />
        <ul className="nav__links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="#">Movies</a>
          </li>
        </ul>
      </nav>

      <header className="header__container">
        <div className="header__description">
          <h1>Find your dream Movie</h1>
        </div>
        <div className="input__wrapper">
          <input
            className="search__input"
            placeholder="Search for a movie or show"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearchClick()}
          />
          <button className="btn" onClick={onSearchClick}>
            <i className="fa fa-search" /> Search
          </button>
        </div>
      </header>

      <main id="movies__main">
        <section>
          <div className="container">
            <div className="movies__controls">
              <h2 className="search-info">Search Results</h2>
              <div>
                <select
                  id="movieSort"
                  name="movieSort"
                  value={sort}
                  onChange={onSortChange}>
                  <option value="">Sort by year</option>
                  <option value="oldest">Oldest to Newest</option>
                  <option value="newest">Newest to Oldest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="movies__loading">
                <i className="fas fa-spinner" />
              </div>
            ) : (
              <div className="movies">
                {movies.length ? (
                  movies.map((m) => (
                    <MovieCard key={m.imdbID} movie={m} className="floating" />
                  ))
                ) : (
                  <p>No results</p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
