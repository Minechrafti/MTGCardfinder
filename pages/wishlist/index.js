import { useRedirectToLogin } from "../../lib/session";
import {useState, useEffect} from "react"
import {useRouter} from "next/router"
import Link from "next/link"
import { getWishList, getCardbyName } from "../../lib/api"; 
import styles from "./index.module.css";


export default function Wishlist({session}){

    useRedirectToLogin(session);

    const [cards, setCards] = useState([])

    useEffect(() => {
        let tmp = []
        async function setupCards(){
            const response = await getWishList(session.user?.id)
            let temp = response[0];
            for (let i = 0; i < response[0]?.cards?.length; i++) {
              if (response[0].cards[i].includes("//")) {
                const res = await getCardbyName(response[0].cards[i]);
                tmp.push(res);
              } else {
                const res = await getCardbyName(response[0].cards[i]);
                tmp.push(res);
              }
            }
            setCards(tmp)
        }
        setupCards()
    },[])

    return(
        <div>
            <h1>Wishlist</h1>

            {
                cards.map(card =>{
                    return (
                      <div>
                        {card.name.includes("//") ? (
                          <Link href={`/card/${card.name}`} passHref>
                            <img
                              className={styles.img}
                              src={card.card_faces[0].image_uris.large}
                            />
                          </Link>
                        ) : (
                          <Link href={`/card/${card.name}`} passHref>
                            <img
                              className={styles.img}
                              src={card.image_uris?.large}
                            />
                          </Link>
                        )}
                      </div>
                    );
                })
            }
        </div>
    )
}