/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { addCardToDeck, createDeck, getDeckByName } from "../../../lib/api";
import {Form, FloatingLabel} from "react-bootstrap"
import { useRedirectToLogin } from "../../../lib/session";
import styles from "./create.module.css"
import {useRouter} from "next/router"

export default function Create({ session }) {
    useRedirectToLogin(session);
  const userId = session?.user?.id;
  const router = useRouter()

  const [data, setData] = useState({ deckName: "", cardName: "", deck: "" });

  const onChange = (e) => {
    console.log(userId);
    let value = e.target.value;
    let name = e.target.name;
    setData({
      ...data,
      [name]: value,
    });
  };

  async function submit() {
    await createDeck(userId, data.deckName);
    router.push('/decks');
  }

  return (
    <Form className={styles.container} onSubmit={() => submit()}>
      <FloatingLabel
        controlId="floatingInput"
        label="Deckname"
        className={styles.input}
        name="deckName"
      >
        <Form.Control placeholder="Vampire" name="deckName" onChange={onChange}/>
      </FloatingLabel>
      {/* <div className={styles.buttonContainer}>
        <button className="button80" onClick={() => submit()}>
          Submit
        </button>
      </div> */}
    </Form>
  );
}
