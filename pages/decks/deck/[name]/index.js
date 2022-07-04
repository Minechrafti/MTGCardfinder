import styles from "./index.module.css";
import { useRouter } from "next/router";
import {
    getDeckByName,
    getCardbyName,
    removeCardfromDeck,
    addCardToDeck,
} from "../../../../lib/api";
import { useEffect, useState } from "react";
import { useRedirectToLogin } from "../../../../lib/session";
import { Table } from "react-bootstrap";

export default function Index({ session }) {
    const router = useRouter();
    const { name } = router.query;
    const [deck, setDeck] = useState();
    const [cards, setCards] = useState([]);
    const [amount, setAmount] = useState(0);

    useRedirectToLogin(session);

    useEffect(() => {
        async function getDeck() {
            const resp = await getDeckByName(name);
            setDeck(resp);
        }
        getDeck();
    }, [name]);

    useEffect(() => {
        let tmp = [];

        function sortDeckWithTypes(param) {

            if (!param) return;

            let orderedArr = [];
            let arr = param;

            let artifacts = [];
            let creatures = [];
            let enchantments = [];
            let instants = [];
            let lands = [];
            let planeswalkers = [];
            let sorceries = [];


            console.log("PARAM: ", param)
            
            let type = "";
            for (let i = 0; i < arr.length; i++) {

                console.log("ARR[i]: ", arr[i]?.type_line)
                type = arr[i]?.type_line;
                if (type?.toLowerCase().includes("artifact")) artifacts.push(arr[i]);
                else if (type?.toLowerCase().includes("creature")) creatures.push(arr[i]);
                else if (type?.toLowerCase().includes("enchantment")) enchantments.push(arr[i]);
                else if (type?.toLowerCase().includes("instant")) instants.push(arr[i]);
                else if (type?.toLowerCase().includes("land")) lands.push(arr[i]);
                else if (type?.toLowerCase().includes("planeswalker")) planeswalkers.push(arr[i]);
                else if (type?.toLowerCase().includes("sorcery")) sorceries.push(arr[i]);
            }

            let arrs = [artifacts, creatures, enchantments, instants, lands, planeswalkers, sorceries];

            arrs.map(cardtype => { cardtype.map(safd => { orderedArr.push(safd) }) });

            console.log("NOICI FUNC: ", orderedArr)
            return orderedArr;

        }

        async function getCardsFromDeck() {
            const response = deck?.cards;
            for (let i = 0; i < response?.length; i++) {
                const resp = await getCardbyName(response[i]);
                tmp.push(resp);
            }
            let anothertmp = sortDeckWithTypes(tmp);
            setCards(anothertmp);
        }
        getCardsFromDeck();
    }, [deck]);

    async function add(name) {
        let asdf = await addCardToDeck(deck.name, name);
        router.reload();
    }
    async function remove(card) {
        let tmp = await removeCardfromDeck(deck.name, card.name);
        router.reload();
    }

    function counter(cardName) {
        let amount = 0;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].name === cardName) amount++;
        }
        return amount;
    }

    let arr = [];
    let typebefore;
    let typeatm = "";
    let arrs = ["artifact", "creature", "enchantment", "instant", "land", "planeswalker", "sorcery"];
    let typecounter = 0;
    let secondBool = false;

    return (
        <div>
            <div className={styles.infos}>
                aoriestniaoersntioearsntioearsntioaersnt
            </div>
            <div className={styles.container}>


                {cards?.map((card) => {
                    

                    if(card === cards[1]) secondBool = true;

                    typebefore = typeatm;

                    arrs.map(cardType => {
                        if (card.type_line.toLowerCase().includes(cardType)) {
                            typeatm = cardType; return;
                        }
                    })
                    let fucku = 0;
                    let bool = false;
                    if (typebefore !== typeatm) {
                        console.log("TYPE COUNTER: ", typecounter);
                        bool = true;
                        fucku = typecounter;
                        typecounter = 0;
                    }



                    if (!arr.includes(card.name)) {
                        arr.push(card.name);
                        console.log("CARDNAME: ", card.name, "AMOUNT: ", counter(card.name))
                        typecounter += counter(card.name)
                        return (

                            <div>
                                {bool && <div className={secondBool ? styles.firstCardfromType : styles.firstCardfromArtifact}><h2>{`${typeatm} (${fucku})`}</h2></div>}
                                <div className={styles.miniContainer}>



                                    <div key={card.name} className={styles.card}>

                                        {card.name.includes("//") ? (
                                            <img
                                                className={styles.img}
                                                src={card.card_faces[0].image_uris.large}
                                            />
                                        ) : (
                                            <img className={styles.img} src={card.image_uris?.large} />
                                        )}
                                        <div className={styles.buttonContainer}>
                                            <button
                                                className={styles.button}
                                                onClick={() => add(card.name)}
                                            >
                                                +
                                            </button>
                                            <button className={styles.button}>{`${counter(
                                                card.name
                                            )}`}</button>
                                            <button className={styles.button} onClick={() => remove(card)}>
                                                -
                                            </button>
                                            <button
                                                className={styles.button}
                                                onClick={() => router.push(`/card/${card.name}`)}
                                            >
                      >
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                        
                        
                    } else return <div></div>;
                })}
            </div>
        </div>
    );
}
