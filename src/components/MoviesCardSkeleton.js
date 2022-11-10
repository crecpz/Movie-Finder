import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const MoviesCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#333" highlightColor="#444">
      {/* <Skeleton width={300} height={400} className="movies-cards-skeleton" /> */}
    <Skeleton className="movies-card-skeleton" count={3} />
      
    </SkeletonTheme>
  );
};

export default MoviesCardSkeleton;
