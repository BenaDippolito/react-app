import React from "react";

// Match the markup/classes used by the original static project so the CSS applies
export default function MovieCard({ movie, onLearnMore, className }) {
  const poster =
    movie.Poster ||
    movie.poster ||
    "https://via.placeholder.com/300x445?text=No+Image";
  const yearText = movie.Year || movie.year || "N/A";

  function handleLearnMore() {
    if (typeof onLearnMore === "function") onLearnMore(movie);
  }

  return (
    <div className={`movie ${className ? className : ""}`}>
      <img src={poster} alt={movie.Title || movie.title} />
      <h2>{movie.Title || movie.title}</h2>
      <h4>{yearText}</h4>
      <button
        type="button"
        onClick={handleLearnMore}
        aria-label={`Learn more about ${movie.Title || movie.title}`}>
        Learn More
      </button>
    </div>
  );
}
