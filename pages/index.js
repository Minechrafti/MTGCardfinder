import { useState, useEffect } from "react";
import { ToggleButton, Form } from "react-bootstrap";
import styles from "./Index.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCardsbyName } from "../lib/api";

export default function Home() {
    let router = useRouter();

    const [cardName, setCardName] = useState("");

    const onChange = (e) => {
        let value = e.target.value;
        setCardName(value);
    };

    const onSubmit = () => {
        async function oneOrMoreCards(cardName) {
            let data = await getCardsbyName(cardName)
            if(!data) return;
            if (data[1]) {
                // router.push(`/cards/${cardName}`)
                let s = { name: cardName, cmc: null, mc: null, color: null, typeLine: null, text: null };
                router.push({
                    pathname: "/cards",
                    query: s,
                })
            }
            else router.push(`/card/${cardName}`);
        }
        oneOrMoreCards(cardName);
    };

    return (
        <div className="App">
            <div onSubmit={onSubmit}>
                <div className={styles.searchcontainer}>
                    <Form.Control
                        className={styles.search}
                        placeholder="Search by Name"
                        onChange={onChange}
                    />
                </div>
                <div className={styles.buttonContainer}>
                    <button className="button80" onClick={onSubmit}>
                        Submit
                    </button>
                </div>
                {/* <img src='./../public/IMG_5480.JPG'></img> */}
            </div>
        </div>
    );
}
