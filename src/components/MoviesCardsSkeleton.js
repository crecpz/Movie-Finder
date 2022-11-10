import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const MoviesCardsSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#333" highlightColor="#444">
      <div className="movies-cards">
        <Skeleton width={300} height={400} className="movies-card-link" />
      </div>
    </SkeletonTheme>
  );
};

export default MoviesCardsSkeleton;
