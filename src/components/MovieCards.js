import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "./MovieCard";

const MovieCards = () => {
  const [movies, setMovies] = useState([]);
  const { type } = useParams();
  let API_URL = "";

  useEffect(() => getMovieData(), []);

  switch (type) {
    case "this-month":
      const firstDate = getFirstDayAndLastDayOfMonth()[0];
      const lastDate = getFirstDayAndLastDayOfMonth()[1];
      API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&primary_release_date.gte=${firstDate}&primary_release_date.lte=${lastDate}`;
      break;
  }

  function getMovieData() {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setMovies(data.results));
  }

  function getFirstDayAndLastDayOfMonth() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return [firstDayOfMonth, lastDayOfMonth].map((date) =>
      date
        .toLocaleString()
        .split(" ")[0]
        .split("/")
        .map((str) => (Number(str) < 10 ? "0" + str : str))
        .join("-")
    );
  }

  const movieCardElements = movies.map((movie) => {
    return <MovieCard movie={movie} />;
  });

  return (
    <div className="movie-cards">
      <div className="container">
        <h3 className="layout-title">This Month</h3>
        <div className="movie-cards__wrapper">{movieCardElements}</div>
      </div>
    </div>
  );
};

export default MovieCards;
