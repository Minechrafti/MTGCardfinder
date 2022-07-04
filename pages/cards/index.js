/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./../../styles/CardsIndex.module.css";
import Link from "next/link";
import {getCardsByParams } from "../../lib/api";

export default function Index() {
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [transformed, setTransformed] = useState(false);
    const param = router.query;
    
    useEffect(() => {
        if (!param) return;
        console.log(param);
        async function getAll () {
            let type = param.typeLine;
            if(param.typeLine.toLowerCase().includes("wolf")) type = "Treefolk";
            if(param.text.toLowerCase().includes("wolf")) {
                router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            }
            let data = await getCardsByParams(param.name, param.cmc, param.mc, param.color, type, param.text);
            setCards(data);
        }
        getAll();
    }, [param]);

    function flipcard () {
        setTransformed(!transformed);
    }
    return (
        <div className={styles.container}>
            {
                cards?.map(card => {
                    if(card.name.includes("//")) {
                        return (
                            <div key={card.id}>
                                <Link href={`/card/${card.card_faces[0].name}`}>
                                    <img
                                        id={styles.img}
                                        className={styles.imageForDetail}
                                        src={
                                            transformed
                                                ? card.card_faces[1].image_uris?.large
                                                : card.card_faces[0].image_uris?.large
                                        }
                                    />
                                </Link>
                                <button onClick={() => flipcard()}>
                              transform
                                </button>
                            </div>
                        );
                    }
                    else {
                        return (
                            <div key={card.id}>
                                <Link href={`/card/${card.name}`}>
                                    <img
                                        id={styles.img}
                                        className={styles.imageForDetail}
                                        src={card.image_uris?.large}
                                    />
                                </Link>
                            </div>
                        );
                    }
                })
            }
        </div>
    );
}