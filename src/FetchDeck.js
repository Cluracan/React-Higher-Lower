const deckUrl = "https://deckofcardsapi.com/api/deck/new/draw/?count=52";

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

export default async function fetchDeckData() {
  const response = await fetch(deckUrl);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const deckData = await response.json();
  const deckArray = deckData.cards.map((data) => {
    return { value: convertToInteger(data.value), image: data.images.svg };
  });
  return deckArray;
}
