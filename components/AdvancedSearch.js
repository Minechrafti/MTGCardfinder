import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Table } from "react-bootstrap";
import styles from "./AdvancedSearch.module.css";
import { getCardsByParams } from "./../lib/api"
import { SearchFacesByImageCommand } from "@aws-sdk/client-rekognition";

const defaultModel = {
    name: "",
    cmc: NaN,
    mc: "",
    color: "",
    text: "",
    typeLine: "",
};

export default function AdvancedSearch() {
    const router = useRouter();
    const [search, setSearch] = useState(defaultModel);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setSearch({
            ...search,
            [name]: value,
        });
    };

    function handleColor(i) {
        const colors = ["B", "R", "U", "G", "W", "C"]
        let value = search.color;
        value += colors[i];
        setSearch(
            {
                ...search,
                color: value
            }
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

         (search)
        let data = await getCardsByParams(search.name, search.cmc, search.mc, search.color, search.typeLine, search.text);
        if(search.typeLine === "Werewolf") {
            "Treefolk"
        }
        if(!data) return;
        if (data[1]) {
            async function oneOrMoreCards(s) {
                router.push({
                    pathname: "/cards",
                    query: s,
                })
    
            }
            oneOrMoreCards(search)
        }
        else router.push(`/card/${data[0].name}`);
    };

    return (
        <div>
            <Table
                size="sm"
                style={{ marginLeft: "5vw", marginRight: "5vw", marginTop: "5vw" }}
                onSubmit={handleSubmit}
            >
                <tbody>
                    <tr>
                        <td>
                            <div className={styles.labelContainer}>Name</div>
                        </td>
                        <td>
                            <Form.Control
                                className={styles.input}
                                placeholder="Indulgent Aristocrat"
                                name="name"
                                onChange={handleChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className={styles.labelContainer}>CMC</div>
                        </td>
                        <td>
                            <Form.Control
                                className={styles.input}
                                placeholder="1"
                                name="cmc"
                                onChange={handleChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className={styles.labelContainer}>Mana Cost</div>
                        </td>
                        <td>
                            <Form.Control
                                className={styles.input}
                                placeholder="{B}"
                                name="mc"
                                onChange={handleChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className={styles.labelContainer}>Color</div>
                        </td>
                        <td>
                            <div style={{ display: "flex" }} className={styles.row}>
                                <div className={styles.column}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <p>Black</p>
                                        <input
                                            type="checkbox"
                                            style={{
                                                marginLeft: "1vw",
                                                marginBottom: "4vw",
                                                width: "20px",
                                                height: "30px",
                                            }}
                                            onChange={() => handleColor(0)}
                                        />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <p>Blue</p>
                                        <input
                                            type="checkbox"
                                            style={{
                                                marginLeft: "1vw",
                                                marginBottom: "4vw",
                                                width: "20px",
                                                height: "30px",
                                            }}
                                            onChange={() => handleColor(2)}
                                        />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <p>White</p>
                                        <input
                                            type="checkbox"
                                            style={{
                                                marginLeft: "1vw",
                                                marginBottom: "4vw",
                                                width: "20px",
                                                height: "30px",
                                            }}
                                            onChange={() => handleColor(4)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.column}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <p>Red</p>
                                        <input
                                            type="checkbox"
                                            style={{
                                                marginLeft: "1vw",
                                                marginBottom: "4vw",
                                                width: "20px",
                                                height: "30px",
                                            }}
                                            onChange={() => handleColor(1)}
                                        />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <p>Green</p>
                                        <input
                                            type="checkbox"
                                            style={{
                                                marginLeft: "1vw",
                                                marginBottom: "4vw",
                                                width: "20px",
                                                height: "30px",
                                            }}
                                            onChange={() => handleColor(3)}
                                        />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <p>Colorless</p>
                                        <input
                                            type="checkbox"
                                            style={{
                                                marginLeft: "1vw",
                                                marginBottom: "4vw",
                                                width: "20px",
                                                height: "30px",
                                            }}
                                            onChange={() => handleColor(5)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Text</td>
                        <td>
                            <Form.Control
                                className={styles.input}
                                placeholder={`{2}, Sacrifice a creature: Put a +1/+1 counter on each Vampire you control.`}
                                name="text"
                                onChange={handleChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Typeline</td>
                        <Form.Control
                            className={styles.input}
                            placeholder={"Creature-Vampire Noble"}
                            name="typeLine"
                            onChange={handleChange}
                        />
                    </tr>
                </tbody>
            </Table>
            <button className="button80" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
}
