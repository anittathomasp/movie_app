import { useEffect, useState } from "react";
import Search from "./components/Search";
import { MovieCad } from "./components/MovieCad";
import { useDebounce } from "react-use";
import { getPopularMovies, updateSearchCount } from "./appwrite";
const API_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  console.log("trendingMovies", trendingMovies);

  useDebounce(() => setDebouncedSearchQuery(searchQuery), 500, [searchQuery]);

  const fetchMovies = async (searchQuery = "") => {
    let endPoint = searchQuery
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchQuery)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    try {
      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        setIsLoading(false);
        let errorMessage = ``;
        try {
          const errorData = await response.json();
          if (errorData && errorData?.status_message) {
            errorMessage = `${errorData?.status_message} (Code:${response.status})`;
          } else if (errorData && errorData.message) {
            errorMessage = `${errorData.message} (Code: ${response.status})`;
          } else {
            errorMessage = ` ${JSON.stringify(errorData)} (Code: ${
              response.status
            })`;
          }
        } catch (jsonParseError) {
          console.warn(
            "Could not parse error response body as JSON:",
            jsonParseError
          );

          try {
            // FURTHER INNER TRY BLOCK: To safely read the body as plain text
            const plainTextError = await response.text();
            if (plainTextError) {
              errorMessage = `API Error: ${plainTextError} (Code: ${response.status})`;
            }
          } catch (textParseError) {
            // CATCH FOR PLAIN TEXT PARSING
            console.warn(
              "Could not parse error response body as plain text:",
              textParseError
            );
            // If even text parsing fails, errorMessage remains the generic HTTP one
          }
        }
        throw new Error(
          errorMessage || "An unexpected error occured, please try again."
        );
      } else {
        let data = await response.json();
        if (searchQuery && data?.results?.length > 0) {
          await updateSearchCount(searchQuery, data?.results?.[0]);
        }
        setMovieList(data);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);

      setError(err.message || "An unexpected error occured,please try again.");
    }
  };
  const fetchTrendingMovies = async () => {
    try {
      const results = await getPopularMovies();
      setTrendingMovies(results);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMovies(debouncedSearchQuery);
  }, [debouncedSearchQuery]);
  useEffect(() => {
    fetchTrendingMovies();
  }, []);
  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="/assets/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span>You'll Enjoy
            Without The Hassle
          </h1>
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </header>
        <section className="trending">
          <h2>Trending Movies</h2>
          <ul>
            {trendingMovies?.length > 0 ? (
              trendingMovies?.map((item, index) => (
                <li key={item?.$id}>
                  <p>{index + 1}</p>
                  <img src={item?.poster_url} alt="poster" />
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>
        </section>
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <ul>
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={index}>
                  <div className="movie-card">
                    <div className="w-full h-[300px] bg-gray-200 rounded-md animate-pulse"></div>

                    <div className="mt-4 px-2">
                      <div className="h-6 w-4/5 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
                      <div className="h-6 w-4/5 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <ul>
              {movieList?.results?.map((movie) => (
                <MovieCad key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
