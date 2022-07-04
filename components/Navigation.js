/* eslint-disable react/react-in-jsx-scope */
import { Navbar, Nav, Container } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { getRandomCard } from "../lib/api";

export default function Navigation({ session }) {
  const router = useRouter();

  async function getRandomCardForNextPage() {
    const card = await getRandomCard();
    router.push(`/card/${card.name}`);
  }
  return (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="light"
        variant="light"
        style={{ zIndex: 1000 }}
      >
        <Container>
          <Link href={"/"} passHref>
            <Navbar.Brand style={{ textDecoration: "none" }}>
              MTG-Card-Finder
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link href="/advanced" passHref>
                <Nav.Link style={{ textDecoration: "none" }}>Advanced</Nav.Link>
              </Link>
              <Link href="/random" passHref>
                <Nav.Link style={{ textDecoration: "none" }}>Random</Nav.Link>
              </Link>
              {session.user && (
                <Link href="/decks" passHref>
                  <Nav.Link style={{ textDecoration: "none" }}>Decks</Nav.Link>
                </Link>
              )}
              {session.user && (
                <Link href={"/wishlist"} passHref>
                  <Nav.Link style={{ textDecoration: "none" }}>
                    WishList
                  </Nav.Link>
                </Link>
              )}
              {session.user ? (
                <Link href="/login" passHref>
                  <Nav.Link
                    style={{ textDecoration: "none" }}
                    onClick={session.logout}
                  >
                    logout
                  </Nav.Link>
                </Link>
              ) : (
                <Link href="/login" passHref>
                  <Nav.Link style={{ textDecoration: "none" }}>login</Nav.Link>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
