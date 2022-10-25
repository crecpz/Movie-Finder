import { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard';
import './App.css';

/*
他把範例網址特定的搜尋 id 拿掉(550?) 換成 popular (可以上去搜尋 popular 就可以得到這個方法)
他應該打算將此渲染出來

*/

function App() {
  // 前 20 個熱門電影
  const API_URL="https://api.themoviedb.org/3/movie/popular?api_key=e86818f56e7d92f357708ecb03052800";
  const [movies, setMovies] = useState([]);
  useEffect(()=> {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setMovies(data.results))
  }, [])

  console.log(movies)
  
  const movieCardElements = movies.map(movieData => {
    return <MovieCard key={movieData.id} {...movieData}/>;
  })

  return (
    <div className="App">{movieCardElements}</div>
  );
}

export default App;
