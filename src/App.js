import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FilmCard from "./components/FilmCard";
import Header from "./components/Header";
import Home from "./page/Home"


/*
他把範例網址特定的搜尋 id 拿掉(550?) 換成 popular (可以上去搜尋 popular 就可以得到這個方法)
他應該打算將此渲染出來

*/

function App() {
  // 前 20 個熱門電影
  // const API_URL="https://api.themoviedb.org/3/movie/popular?api_key=e86818f56e7d92f357708ecb03052800";
  const API_URL =
    "https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc";
  // const [movies, setMovies] = useState([]);

  // useEffect(() => {
  //   fetch(API_URL)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.results));
  // }, []);

  // const movieCardElements = movies.map((movieData) => {
  //   return <FilmCard key={movieData.id} {...movieData} />;
  // });

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="movie/:id" element={<h1>單頁電影細節葉面</h1>}></Route>
          <Route path="movies/:type" element={<h1>3</h1>}></Route>
          <Route path="/watchlist" element={<h1>watchlist</h1>}></Route>
          <Route path="/*" element={<h1>not found</h1>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
