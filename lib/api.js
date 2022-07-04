const SCRYFALL_URL = "https://api.scryfall.com/cards/";

const URL = "http://localhost:3001";

function sleep(delay) {
    return new Promise(r => setTimeout(r, delay));
}


export async function login({ email, password }) {
    const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });

    if (!response.ok) {
        return Promise.reject(response);
    }

    const data = await response.json();
    return data;
}

export async function register(email, password) {
    const response = await fetch(`${URL}/register`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        return Promise.reject(response);
    }

    const data = await response.json();
    return data;
}

export async function getDeckAndUri() {
    const decks = await getDecks();
    const firstcards = decks.map(deck => { return deck.cards[0]; });
    const getFirstCards = async (firstcard) => {
        await sleep(1000);

        const card = await getCardbyName(firstcard)
        if (card?.name?.includes("//")) return card.card_faces[0].image_uris?.art_crop;
        else return card?.image_uris?.art_crop;
    }
    const uris = await Promise.all(firstcards.map(firstcard => getFirstCards(firstcard)));
    let arr = [];
    for (let i = 0; i < decks.length; i++) {
        arr.push({ deck: decks[i], uris: uris[i] });
    }
    return arr;
}

export async function createDeck(userId, name) {
        let obj = {
        userId,
        name,
        cards: []
    }

    const response = await fetch(`${URL}/decks`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(obj)

    });
    (JSON.stringify(obj));
    if (!response.ok) {
        return Promise.reject(response);
    }

    const data = await response.json();
    return data;
}

export async function getDecks() {
    const response = await fetch(`${URL}/decks`);
    const decks = await response.json();
    ("TEST");
    if (!response.ok) {
        return Promise.reject(response.json);
    }
    return decks;
}

export async function getDeck(id) {
    const response = await fetch(`${URL}/decks/${id}`);

    if (!response.ok) {
        return Promise.reject(response);
    }

    return response.json();
}

export async function getWishList(userId) {
  const response = await fetch(`${URL}/decks?name=Wishlist&userId=${userId}`);

  if (!response.ok) {
    return Promise.reject(response);
  }

  const resp = response.json();

  return resp;
}

export async function getDeckByName(name) {

    let decks;

    const response = await fetch(`${URL}/decks`);
    const data = await response.json();
    if (data) decks = data;
    else return null;

    const searchedDeck = decks.filter(deck => deck.name === name);

    (searchedDeck)

    if (!response.ok) {
        return Promise.reject(response);
    }
    return searchedDeck[0];
}

export async function getCardsFromDeckByName(deckName) {
    const deck = await getDeckByName(deckName);

    let cards = deck.cards;

    let arr = [];
    for (let i = 0; i < cards.length; i++) {
        arr.push(await getCardbyName(cards[i]));
    }

    (arr)
    return arr;

}

export async function addCardToDeck(deckName, cardName) {

    let deck = await getDeckByName(deckName);

    deck.cards?.push(cardName);

    const response = await fetch(`${URL}/decks/${deck?.id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ userId: deck.userId, name: deck.name, cards: deck.cards, id: deck.id }),
    });

    if (!response.ok) {
        return Promise.reject(response);
    }

    const data = await response.json();
    return data;
}

export async function removeCardfromDeck(deckName, cardName) {

    let realName = cardName;

    if(cardName.includes("//")) {
        let tmp = cardName.split("");
        let deez = cardName.indexOf("/");
        let x = cardName.length - deez;
        tmp.splice(deez-1, x+1)
        let asdf = tmp.join('');
        realName = asdf;
    }

    let deck = await getDeckByName(deckName);
    let len = deck.cards.length;
    for (let i = 0; i < deck.cards.length; i++) {
        if (realName === deck.cards[i]) {
            
            if(deck.cards.length === len) deck.cards.splice(i, 1);
            
        }
    }

    const response = await fetch(`${URL}/decks/${deck?.id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ userId: deck.userId, name: deck.name, cards: deck.cards, id: deck.id }),
    });

    if (!response.ok) {
        return Promise.reject(response);
    }

    const data = await response.json();
    console.log("DATA: ", data)
    return data;

}

export async function getCardbyName(cardName) {
    let card;

    if(!cardName) return;

    function trim(cardName) {
        let castedName = "";
        let multipleWords = [];
        if(cardName.includes(" ")) multipleWords = cardName.split(" ");
        multipleWords?.map((word) => (castedName += word));
        return castedName;
    }

    const res = await fetch(`${SCRYFALL_URL}search?q=${trim(cardName)}`);
    const data = await res.json();
    if (data.data !== undefined) return data.data[0];
    else return null;
}

export async function getCardsbyName(cardName) {
    let card;

    function trim(cardName) {
        let castedName = "";
        let multipleWords = cardName.split(" ");
        multipleWords.map((word) => (castedName += word));
        return castedName;
    }

    const res = await fetch(`${SCRYFALL_URL}search?q=${trim(cardName)}`);
    const data = await res.json();
    return data.data;
}

export async function getSidebyName(cardName, side) {
    let card;

    const res = await fetch(`${SCRYFALL_URL}search?q=${cardName}`);
    const data = await res.json();
    if (data.data !== undefined) card = data.data[0].card_faces[side];
    else card = null;
    return card;
}

export async function getRandomCard() {
    const res = await fetch(`${SCRYFALL_URL}random`);
    const data = await res.json();
    return data;
}

export async function getCardByParams(name, cmc, mc, color, typeline, text) {
    let query = "";
    if (name) query += name + " ";
    if (text || color || mc || cmc || typeline) {
        query += "(";
    }
    if (typeline) {
        query += `type=${typeline} `;
    }
    if (text) {
        let oracles;
        oracles = text.split(" ");
        oracles.map((oracle) => (query += `oracle:${oracle} `));
    }
    if (color) query += `color=${color} `;
    if (mc) query += `mana=${mc.replaceAll("{", "").replaceAll("}", "")} `;
    if (cmc) query += `cmc=${cmc} `;

    if (text || color || mc || cmc || typeline) query += ")";
    const res = await fetch(`${SCRYFALL_URL}search?q=${query}`);
    const data = await res.json();
    return data.data[0];
}

export async function getCardsByParams(name, cmc, mc, color, typeline, text) {
    let query = "";
    if (name && name !== " ") query += name + " ";
    if (text || color || mc || cmc || typeline) {
        query += "(";
    }
    if (typeline && typeline !== " ") {
        query += `type=${typeline} `;
    }
    if (text && text !== " ") {
        let oracles;
        oracles = text.split(" ");
        oracles.map((oracle) => (query += `oracle:${oracle} `));
    }
    if (color && color !== " ") query += `color=${color} `;
    if (mc && mc !== " ")
        query += `mana=${mc.replaceAll("{", "").replaceAll("}", "")} `;
    if (cmc && cmc !== " ") query += `cmc=${cmc} `;

    if (text || color || mc || cmc || typeline) query += ")";
    const res = await fetch(`${SCRYFALL_URL}search?q=${query}`);
    const data = await res.json();
    return data.data;
}
