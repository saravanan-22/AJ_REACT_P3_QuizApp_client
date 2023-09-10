import React from "react";
import Header from "../Header/Header";
import "./home.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import Points from "../Point/Points";
import background from "../images/background.jpg";

const Home = () => {
  const backgroundImageStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <div
      style={{
        ...backgroundImageStyle,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
      }}
    >
      <Header />
      <h2
        className="text-white"
        style={{
          backgroundColor: "black",
          padding: "0.2em",
          width: "40vw",
          margin: "auto",
        }}
      >
        Welcome to the Quiz Game!{" "}
      </h2>
      <p className="text-light">Test your knowledge and have fun.</p>
      <p className="text-light">Follow these instruction:</p>
      <ul style={{ listStyle: "none", color: "white", fontSize: "20px" }}>
        <li style={{ textDecoration: "underline" }}>
          Answer the questions within the time limit.
        </li>
      </ul>
      <section
        style={{ marginTop: "5em", marginBottom: "2em", textAlign: "center" }}
      >
        <Container>
          <div className="text-animation mb-2">Get Ready to Play!</div>
          <Link to="/Gk" style={{ textDecoration: "none" }}>
            <Button variant="secondary">START</Button>
          </Link>
          <Points />
        </Container>
      </section>
    </div>
  );
};

export default Home;
