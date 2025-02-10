const deckIdUrl =
  "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
const drawCardUrl = (deckId) =>
  `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
const cardBackUrl = "https://deckofcardsapi.com/static/img/back.png";

const convertToInteger = (cardValue) => {
  switch (cardValue) {
    case "KING":
      return 13;
    case "QUEEN":
      return 12;
    case "JACK":
      return 11;
    case "ACE":
      return 1;
    default:
      return parseInt(cardValue);
  }
};

export async function fetchDeckId() {
  const response = await fetch(deckIdUrl);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const deckData = await response.json();
  return deckData.deck_id;
}

export async function fetchCardBack() {
  return new Promise((res, rej) => {
    const cardBack = new Image();
    cardBack.src = cardBackUrl;
    cardBack.onload = () => {
      res(cardBack);
    };
  });
}

export async function fetchCard(deckId) {
  const response = await fetch(drawCardUrl(deckId));
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const cardData = await response.json();

  return {
    cardImageSrc: cardData.cards[0].image,
    cardValue: convertToInteger(cardData.cards[0].value),
  };
}
