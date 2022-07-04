import { useEffect, useState } from "react";
import { getRandomCard } from "../lib/api";
import Link from "next/link";
import styles from "./random.module.css";
import {Form} from "react-bootstrap"

export default function Random() {
  const [rangeValue, setRangeValue] = useState();
  const [cards, setCards] = useState([]);

  function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }

  useEffect(() => {
    let arr = [];
    arr = cards;
    async function yoMama() {
      for (let i = 0; i < 10; i++) {
        sleep(100);
        let card = await getRandomCard();
        arr.push(card);
      }
      setCards(arr);
    }
    yoMama();
  }, []);

  const getCardsWithRange = async (e) => {
    let value = e.target.value;

    sleep(100);

    if (!value === e.target.value) return;

    value;
    setRangeValue(value);
    sleep(100);
    let range = value;
    let array = [];
    for (let i = 0; i < range; i++) {
      let card = await getRandomCard();
      array.push(card);
    }
    setCards(array);
  };
  return (
    <div>
      <div className={styles.inputContainer}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Number of Random Cards</Form.Label>
          <Form.Control
            placeholder="20"
            name="range"
            onChange={getCardsWithRange}
          />
        </Form.Group>
      </div>
      {cards ? (
        <div>
          {cards.map((card) => {
            return (
              <div className={styles.cardsContainer} key={card.id}>
                {card.name.includes("//") ? (
                  <Link href={`/card/${card.name}`} passHref>
                    <img
                      className={styles.img}
                      src={card?.card_faces?.image_uris?.large}
                    ></img>
                  </Link>
                ) : (
                  <Link href={`/card/${card.name}`} passHref>
                    <img
                      className={styles.img}
                      src={card?.image_uris.large}
                    ></img>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
