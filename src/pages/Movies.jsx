import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard.jsx";
import Modal from "../components/Modal.jsx";
import { useLocation } from "react-router-dom";

export default function Movies() {
  const [currentMovies, setCurrentMovies] = useState([]);
  const [searchInfo, setSearchInfo] = useState("Search Results");
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [modalMovie, setModalMovie] = useState(null);
  const [modalDetails, setModalDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

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

  // When a movie is selected for the modal, fetch full details (plot, rating)
  useEffect(() => {
    if (!modalMovie) return;

    let cancelled = false;

    async function fetchDetails() {
      // If we don't have an imdbID, try to fetch by title (best-effort)
      const apiKey = "baf42048";
      const byId = modalMovie.imdbID;
      const url = byId
        ? `https://omdbapi.com/?i=${byId}&plot=full&apikey=${apiKey}`
        : `https://omdbapi.com/?t=${encodeURIComponent(
            modalMovie.Title || modalMovie.title || ""
          )}&plot=full&apikey=${apiKey}`;

      try {
        setModalLoading(true);
        setModalError(null);
        setModalDetails(null);
        const res = await fetch(url);
        const data = await res.json();
        if (cancelled) return;
        if (data?.Response === "False") {
          setModalError(data?.Error || "Details not found");
        } else {
          setModalDetails(data);
        }
      } catch (err) {
        if (!cancelled) setModalError("Failed to fetch details");
      } finally {
        if (!cancelled) setModalLoading(false);
      }
    }

    fetchDetails();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalMovie]);

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
                      onLearnMore={(movie) => setModalMovie(movie)}
                    />
                  ))}
            </div>
          </div>
        </section>
      </main>

      {modalMovie && (
        <Modal
          title={
            modalDetails?.Title ||
            modalMovie.Title ||
            modalMovie.title ||
            "Details"
          }
          onClose={() => {
            setModalMovie(null);
            setModalDetails(null);
            setModalError(null);
          }}>
          <div className="modal-movie">
            <img
              src={
                modalDetails?.Poster && modalDetails.Poster !== "N/A"
                  ? modalDetails.Poster
                  : modalMovie.Poster && modalMovie.Poster !== "N/A"
                  ? modalMovie.Poster
                  : modalMovie.poster
              }
              alt={modalDetails?.Title || modalMovie.Title || modalMovie.title}
              style={{ maxWidth: "200px", marginRight: "1rem" }}
            />
            <div>
              <h4>
                {modalDetails?.Title || modalMovie.Title || modalMovie.title}
              </h4>
              <p>
                Year:{" "}
                {modalDetails?.Year ||
                  modalMovie.Year ||
                  modalMovie.year ||
                  "N/A"}
              </p>

              {modalLoading && <p>Loading details...</p>}
              {modalError && <p className="error">{modalError}</p>}

              {modalDetails?.BoxOffice && modalDetails.BoxOffice !== "N/A" && (
                <p>
                  <strong>Box office:</strong> {modalDetails.BoxOffice}
                </p>
              )}

              {!modalLoading && modalDetails && (
                <>
                  <p>
                    <strong>IMDb rating:</strong>{" "}
                    {modalDetails.imdbRating &&
                    modalDetails.imdbRating !== "N/A"
                      ? `${modalDetails.imdbRating} / 10`
                      : "Not available"}
                  </p>

                  <p>
                    <strong>Plot:</strong>
                    <br />
                    {modalDetails.Plot && modalDetails.Plot !== "N/A"
                      ? modalDetails.Plot
                      : "Plot not available."}
                  </p>

                  <div style={{ marginTop: "1rem" }}>
                    {/* Trailer: OMDb does not provide trailer URLs; link to IMDb video gallery and YouTube search fallback */}
                    {modalMovie.imdbID ? (
                      <p>
                        <a
                          href={`https://www.imdb.com/title/${modalMovie.imdbID}/videogallery/`}
                          target="_blank"
                          rel="noopener noreferrer">
                          Watch trailer on IMDb
                        </a>
                        {" — "}
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                            `${
                              modalDetails?.Title ||
                              modalMovie.Title ||
                              modalMovie.title
                            } trailer official`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer">
                          Search trailer on YouTube
                        </a>
                      </p>
                    ) : (
                      <p>No trailer link available.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
