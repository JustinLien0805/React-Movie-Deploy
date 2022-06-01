import React from "react";
import { useEffect, useState } from "react";
import Movie from "../Movies/Movie";
import "../..//App.css";
import axios from "axios";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/react";
const loaderCSS = css`
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
`;

const Home = () => {
  const [movieName, setMovieName] = useState("");
  const [avgs, setAvgs] = useState([]);
  // default value will be recommandation
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const genre = ["Action", "Romance", "Sci-Fi", "Comedy", "Horror"];

  // get recommandation
  useEffect(async () => {
    axios
      .get("https://react-movie-justinl.herokuapp.com/recommand")
      .then((response) => {
        setMovies(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const searchMovie = async (movieName) => {
    setLoading(true);
    await axios
      .post("https://react-movie-justinl.herokuapp.com/search", {
        movieName: movieName,
      })
      .then((response) => {
        setLoading(false)
        setMovies(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false)
        console.log(error);
      });
  };
  useEffect(() => {
    if (movieName.length !== 0) {
      searchMovie(movieName);
    }
  }, [movieName]);

  // get movie's score
  useEffect(async () => {
    const promises = movies.map(async (movie) => {
      const score = await axios.post(
        "https://react-movie-justinl.herokuapp.com/avg",
        {
          mid: movie.movie_id,
        }
      );
      console.log(score);
      return score.data._avg.score;
    });
    const scores = await Promise.all(promises);
    setAvgs(scores);
  }, [movies]);

  // logout function
  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const findMovieByGenre = async (e) => {
    setLoading(true)
    await axios
      .post("https://react-movie-justinl.herokuapp.com/genre", {
        genre: e.currentTarget.value,
      })
      .then((response) => {
        setLoading(false)
        setMovies(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false)
        console.log(error);
      });
  };

  return (
    <>
      <div className="header">
        <Grid container style={{ width: "100%" }}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <h1>Movie Search</h1>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "flex-start",
                p: 1,
                m: 1,
                borderRadius: 5,
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  width: 125,
                  color: "#f9d3b4",
                  borderColor: "#f9d3b4",
                  "&:hover": {
                    backgroundColor: "#f9d3b4",
                    color: "#212426",
                    borderColor: "#f9d3b4",
                  },
                }}
                onClick={logout}
              >
                logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </div>
      <div className="search">
        <input
          type="text"
          placeholder="Search a movie"
          value={movieName}
          onChange={(e) => {
            setMovieName(e.target.value);
          }}
        />
      </div>
      <Box
        style={{ width: "100%" }}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {genre.map((g) => (
          <Button
            key={g}
            value={g}
            variant="outlined"
            color="secondary"
            sx={{
              m: 2,
              width: 125,
              color: "#f9d3b4",
              borderColor: "#f9d3b4",
              "&:hover": {
                backgroundColor: "#f9d3b4",
                color: "#212426",
                borderColor: "#f9d3b4",
              },
            }}
            onClick={findMovieByGenre}
          >
            {g}
          </Button>
        ))}
      </Box>
      <HashLoader
           css={loaderCSS}
           color={"white"}
           loading={loading}
           size={150}
         />
      {movieName.length >= 0 && movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie, index) => (
            <Movie movie={movie} key={movie.movie_id} avg={avgs[index]} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>no movies found</h2>
        </div>
      )}
    </>
  );
};

export default Home;
