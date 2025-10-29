import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);

  useEffect(() => {
    setInput(q);
  }, [q]);

  function onSearch() {
    const value = (input || "").trim();
    if (!value) return;
    navigate(`/movies?q=${encodeURIComponent(value)}`);
  }

  const [menuOpen, setMenuOpen] = useState(false);
  function openMenu() {
    setMenuOpen(true);
  }
  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <div className="overlay-container">
        <div className="overlay" />

        <nav className="nav__container">
          <img className="logo" src="/assets/movie-icon.png" alt="Logo" />
          <button
            className="btn__menu"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={openMenu}>
            <i className="fa fa-bars" />
          </button>

          <ul className="nav__links">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav__link${isActive ? " nav__link--active" : ""}`
                }>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/movies"
                className={({ isActive }) =>
                  `nav__link nav__link--primary${
                    isActive ? " nav__link--active" : ""
                  }`
                }>
                Movies
              </NavLink>
            </li>
          </ul>

          <div
            className={`menu__backdrop ${
              menuOpen ? "menu__backdrop--open" : ""
            }`}
            role="dialog"
            aria-modal="true">
            <button
              className="btn__menu btn__menu--close"
              onClick={closeMenu}
              aria-label="Close menu">
              <i className="fa fa-times" />
            </button>
            <ul className="menu__links">
              <li className="menu__list">
                <NavLink to="/" className="menu__link" onClick={closeMenu} end>
                  Home
                </NavLink>
              </li>

              <li className="menu__list">
                <NavLink
                  to="/movies"
                  className="menu__link"
                  onClick={closeMenu}>
                  Movies
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        <header className="header__container">
          <div className="header__description">
            <h2>Find your dream Movie</h2>
          </div>

          <div className="input__wrapper">
            <input
              className="search__input"
              placeholder="Search for a movie or show"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              aria-label="Search"
            />
            <button
              className="search__button"
              type="button"
              aria-label="Search"
              onClick={onSearch}>
              <i className="fa fa-search" />
            </button>
          </div>
        </header>

        {children}
      </div>
      {/* reel-container is a separate container placed after the overlay container */}
      {location.pathname === "/" && <Reel />}
    </>
  );
}

// Reel component: countdown from 10 -> 1, update reel opacity, then show message
const Reel = () => {
  const [count, setCount] = useState(10);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (showMessage) return;
    const step = 2000; // 2s per number
    const id = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(id);
          setShowMessage(true);
          return 1;
        }
        return c - 1;
      });
    }, step);
    return () => clearInterval(id);
  }, [showMessage]);

  const opacity = Math.max(0.15, count / 10);

  return (
    <div
      className="reel-container"
      aria-hidden={showMessage ? "false" : "true"}>
      <div className="movie-reel" style={{ opacity }}>
        <div className="reel-content" />
      </div>

      <div className="reel-overlay">
        {!showMessage ? (
          <div className="count-number" aria-live="polite">
            {count}
          </div>
        ) : (
          <div className="reel-message">
            Please select your movie!!
          </div>
        )}
      </div>
    </div>
  );
};
