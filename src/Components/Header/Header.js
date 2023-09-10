import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import image from "../images/logo.svg.png";

const Header = () => {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate("/ProfilePage");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      style={{
        position: "fixed",
        top: "0",
        zIndex: "100",
        width: "100%",
        backgroundColor: "rgba(128, 126, 126, 0.6)",
      }}
    >
      <Container fluid>
        <Navbar.Brand href="">
          {" "}
          <Link to="/Home">
            <img src={image} alt="logo" width="100px" />
          </Link>{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Button
              variant="outline-light"
              style={{ margin: "auto" }}
              onClick={handleProfileClick}
            >
              <FaRegCircleUser />
              <span> Profile</span>
            </Button>{" "}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
