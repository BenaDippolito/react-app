import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Layout from "./components/Layout";

export default function App() {
  return (
    <div className="app-root">
      <main className="app-main">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
          </Routes>
        </Layout>
      </main>
    </div>
  );
}
