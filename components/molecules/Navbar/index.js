import React from "react";
import BootstrapNavbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import {
  Github as GithubIcon,
  Telegram as TelegramIcon,
} from "react-bootstrap-icons";

export default function Navbar() {
  return (
    <BootstrapNavbar
      sticky="top"
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
    >
      <Container>
        <BootstrapNavbar.Brand href="/">Waifu AnimeMoeUs</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="responsive-BootstrapNavbar-nav" />
        <BootstrapNavbar.Collapse id="responsive-BootstrapNavbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              href="https://github.com/animemoeus/waifu-animemoeus"
              target="_blank"
            >
              <Button variant="outline-light">
                <GithubIcon /> Github
              </Button>
            </Nav.Link>
            <Nav.Link
              eventKey={2}
              href="https://t.me/animemoeus_bot"
              target="_blank"
            >
              <Button variant="outline-light">
                <TelegramIcon /> Telegram Bot
              </Button>
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
