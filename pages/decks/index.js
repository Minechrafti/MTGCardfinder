import Link from "next/link";
import { useEffect, useState } from "react";
import { getDeckAndUri } from "../../lib/api";
import styles from "./index.module.css";
import useRouter from "next/router";
import { useRedirectToLogin } from "../../lib/session";

export default function DecksPage({ session }) {
  const [decks, setDecks] = useState([]);
  const router = useRouter;

  useRedirectToLogin(session);

  useEffect(() => {
    async function getAllDecks() {
      const response = await getDeckAndUri();
      console.log(response[0]);
      let tmp = [];
      for (let i = 0; i < response.length; i++) {
        if(!response[i].deck?.name.includes("Wishlist")){
          if (response[i].deck?.userId === session.user?.id) {
            tmp.push(response[i]);
          }
        }
      }
      setDecks(tmp);
    }
    getAllDecks();
  }, [session.decks]);

  return (
    <div>
      <h1>Your Decks</h1>
      {decks.map((deck) => {
        return (
          <div className={styles.deck}>
              <Link href={`/decks/deck/${deck.deck?.name}`}>
                <div
                  className={styles.linkContainer}
                  style={{ backgroundImage: `url(${deck.uris})` }}
                >
                  <h1 className={styles.title}>{deck.deck.name}</h1>
                </div>
              </Link>
          </div>
        );
      })}
      <Link href="/decks/deck/create">
        <div className={styles.float}>
          <p className={styles.myfloat}>+</p>
        </div>
      </Link>
    </div>
  );
}
