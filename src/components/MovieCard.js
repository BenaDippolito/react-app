import React from "react";

export default function MovieCard({ movie, className }) {
  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x445?text=No+Image";

  return (
    <div className={`movie ${className ? className : ""}`}>
      <img src={poster} alt={movie.Title} />
      <h2>{movie.Title}</h2>
      <h4>{movie.Year}</h4>
      <button type="button">Learn More</button>
    </div>
  );
}
