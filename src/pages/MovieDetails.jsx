import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://omdbapi.com/?i=${encodeURIComponent(
            id
          )}&plot=full&apikey=baf42048`
        );
        const data = await res.json();
        if (cancelled) return;
        if (data?.Response === "False") {
          setError(data?.Error || "Movie not found");
        } else {
          setDetails(data);
        }
      } catch (err) {
        if (!cancelled) setError("Failed to fetch movie details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <section className="page movie-details-page">
      <div className="container">
        <button className="btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {loading && <p>Loading movie details…</p>}
        {error && <p className="error">{error}</p>}

        {details && (
          <div className="movie-details">
            <div className="movie-details__poster">
              <img
                src={
                  details.Poster && details.Poster !== "N/A"
                    ? details.Poster
                    : "https://via.placeholder.com/300x445?text=No+Image"
                }
                alt={details.Title}
              />
            </div>

            <div className="movie-details__info">
              <h1>{details.Title}</h1>
              <p>
                <strong>Year:</strong> {details.Year}
              </p>
              <p>
                <strong>Runtime:</strong> {details.Runtime}
              </p>
              <p>
                <strong>Genre:</strong> {details.Genre}
              </p>
              <p>
                <strong>IMDb rating:</strong>{" "}
                {details.imdbRating && details.imdbRating !== "N/A"
                  ? `${details.imdbRating} / 10`
                  : "Not available"}
              </p>

              <h3>Plot</h3>
              <p>
                {details.Plot && details.Plot !== "N/A"
                  ? details.Plot
                  : "No plot available."}
              </p>

              {details.imdbID && (
                <p>
                  <a
                    href={`https://www.imdb.com/title/${details.imdbID}/`}
                    target="_blank"
                    rel="noopener noreferrer">
                    View on IMDb
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
