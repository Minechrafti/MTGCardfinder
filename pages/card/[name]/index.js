/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import styles from "./index.module.css";
import Link from "next/link"
import { useRouter } from "next/router";
import { getCardbyName, getSidebyName, getDecks, addCardToDeck } from "../../../lib/api";

const placeholder =
  "https://as1.ftcdn.net/v2/jpg/04/34/72/82/1000_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg";

export default function IndexPage({ session }) {
  const router = useRouter();
  const [card, setCard] = useState();

  const [transformed, settransformed] = useState(false);
  const [canTransform, setCanTransform] = useState(false);
  const [decks, setDecks] = useState([]);
  const [addToDeckBool, setAddToDeckBool] = useState(false);
  const { name } = router.query;

  useEffect(() => {
    if (name === "" || name === undefined || name === null) return;
    getCardbySide(0);
  }, [name]);

  useEffect(() => {
    async function getAllDecks() {
      if (decks === undefined || decks.length === 0 || decks === null) {
        if (addToDeckBool) {
          let tmp = [];
          const response = await getDecks();
          for (let i = 0; i < response.length; i++) {
            if (response[i].userId === session.user.id) {
              tmp.push(response[i]);
            }
          }
          setDecks(tmp);
        } else return;
      } else return;
    }
    getAllDecks();
  }, [addToDeckBool]);

  async function getCardbySide(side) {
    let cardNametmp = name.trim();
    const cardTmp = await getCardbyName(cardNametmp);
    setCard(cardTmp);

    if (cardTmp !== null) {
      if (cardTmp.name.includes("//")) {
        setCanTransform(true);
        const adjsfso = await getSidebyName(cardTmp.name, side);
        setCard(adjsfso);
      }
    } else router.push("/error/404");
  }

  function handleClickCardSide() {
    if (!transformed) {
      settransformed(true);
      getCardbySide(1);
    } else {
      settransformed(false);
      getCardbySide(0);
    }
  }

  async function addCard(deck) {
    await addCardToDeck(deck, card.name);
  }

  function handleClickShowDecks() {
    if (!addToDeckBool) {
      setAddToDeckBool(true);
    } else {
      setAddToDeckBool(false);
    }
  }
  return (
    card && (
      <div>
        <div className={styles.littleContainer}>
          <img className={styles.imageForDetail} src={card.image_uris?.large} />
          {canTransform && (
            <div className={styles.buttonContainer}>
              <button
                className="button80"
                onClick={() => handleClickCardSide()}
              >
                Transform
              </button>
            </div>
          )}
        </div>
        <a href={card?.purchase_uris?.cardmarket}>
          <button className="button80">
            Cardmarket
          </button>
        </a>
        <Table size="sm" style={{ marginLeft: "5vw", marginRight: "5vw" }}>
          <tbody>
            <tr>
              <td>Name: </td>
              <td>{card && card.name}</td>
            </tr>
            <tr>
              <td>CMC:</td>
              <td>{card && card.mana_cost}</td>
            </tr>
            <tr>
              <td>Type & Subtype: </td>
              <td>{card && card.type_line}</td>
            </tr>
            <tr>
              <td>Oracle Text:</td>
              <td>{card && card.oracle_text}</td>
            </tr>
            <tr>
              <td>Power & Toughness: </td>
              <td>
                {card && card.power} / {card && card.toughness}
              </td>
            </tr>
          </tbody>
        </Table>
        {session.user?.id && (
          <div className={styles.singleButton}>
            <button className="button80" onClick={() => handleClickShowDecks()}>
              add to Deck
            </button>
          </div>
        )}
        <div className={styles.row}>
          {addToDeckBool &&
            decks.map((deck) => {
              return (
                <div key={deck.id} className={styles.deckContainer}>
                  <div className={styles.column}>
                    <h1>{deck.name}</h1>
                  </div>
                  <div className={styles.buttonContainer}>
                    <button
                      className="button80"
                      onClick={() => addCard(deck.name)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    )
  );
}
