import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard.jsx";
import { useLocation } from "react-router-dom";

export default function Movies() {
  const [currentMovies, setCurrentMovies] = useState([]);
  const [searchInfo, setSearchInfo] = useState("Search Results");
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("");

  async function renderMovies(term) {
    if (!term) return;
    try {
      setLoading(true);
      setCurrentMovies([]);
      const res = await fetch(
        `https://omdbapi.com/?s=${encodeURIComponent(term)}&apikey=baf42048`
      );
      const data = await res.json();
      const results = Array.isArray(data?.Search) ? data.Search : [];
      setCurrentMovies(results);
    } catch (err) {
      console.error("Failed to fetch movies", err);
      setCurrentMovies([]);
    } finally {
      setLoading(false);
    }
  }

  // run search automatically if `?q=` is present in the URL
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (q) {
      setSearchInfo(`Search Results for "${q}"`);
      renderMovies(q);
    } else {
      setSearchInfo("Search Results");
      setCurrentMovies([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  function toYear(y) {
    const n = parseInt(y, 10);
    return Number.isFinite(n) ? n : -Infinity;
  }

  function handleSortChange(e) {
    const opt = e.target.value;
    setSortOption(opt);
    if (!opt || !currentMovies.length) return;

    const sorted = [...currentMovies];
    if (opt === "newest") {
      sorted.sort((a, b) => toYear(b.Year) - toYear(a.Year));
    } else if (opt === "oldest") {
      sorted.sort((a, b) => toYear(a.Year) - toYear(b.Year));
    }
    setCurrentMovies(sorted);
  }

  return (
    <section id="movies" className="page movies-page">
      <main id="movies__main">
        <section>
          <div className="container">
            <div className="row">
              <div className="movies__controls">
                <h2 className="search-info">{searchInfo}</h2>
                <div>
                  <label htmlFor="movieSort" className="visually-hidden">
                    Sort by year
                  </label>
                  <select
                    id="movieSort"
                    name="movieSort"
                    onChange={handleSortChange}
                    value={sortOption}>
                    <option disabled value="">
                      Sort by year
                    </option>
                    <option value="oldest">Oldest to Newest</option>
                    <option value="newest">Newest to Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="movies">
              {loading && (
                <div className="movies__loading">
                  <i className="fas fa-spinner"></i>
                </div>
              )}
              {!loading && currentMovies.length === 0 && (
                <p>No results found.</p>
              )}
              {!loading &&
                currentMovies
                  .slice(0, 6)
                  .map((m) => (
                    <MovieCard
                      key={m.imdbID || m.id || m.Title}
                      movie={m}
                      className="floating"
                    />
                  ))}
            </div>
          </div>
        </section>
      </main>
    </section>
  );
}
