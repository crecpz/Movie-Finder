import MoviesCard from "./MoviesCard";

const MoviesCards = ({ movies }) => {
  return (
    <div className="movies-cards">
      {movies.results
        ? movies.results.map((movie) => {
            return <MoviesCard key={movie.id} movie={movie} />;
          })
        : ""}
    </div>
  );
};

export default MoviesCards;
