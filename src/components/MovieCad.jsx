export const MovieCad = ({
  movie: { title, original_language, poster_path, vote_average, release_date },
}) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "assets/no-movie.png"
        }
        alt="movieImg"
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="assets/star.svg" alt="startIocn" />
            <p>{vote_average ? vote_average?.toFixed(1) : "N/A"}</p>
            <span>*</span>

            <p className="lang">{original_language}</p>
            <span>*</span>
          </div>
          <p className="year">
            {release_date ? release_date?.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
