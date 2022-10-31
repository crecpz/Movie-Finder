import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MovieList from "./components/MovieCards";
import Home from "./page/Home"
import MovieDetail from "./page/MovieDetail";

// ! 記得處理 not-found

function App() {
  const API_URL =
    "https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc";

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="movie/:id" element={<MovieDetail />}></Route>
          <Route path="movies/:type" element={<MovieList />}></Route>
          <Route path="/watchlist" element={<h1>watchlist</h1>}></Route>
          <Route path="/*" element={<h1>not found</h1>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
