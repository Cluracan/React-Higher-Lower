import { useState, useEffect } from "react";
import { fetchCard, fetchDeckId, fetchCardBack } from "./DeckOfCardsAPI";
import reactLogo from "./assets/react.svg";
import Canvas from "./Canvas";
import "./App.css";

function App() {
  const [deckId, setDeckId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardsRemaining, setCardsRemaining] = useState(null);
  const [imageSrc, SetImageSrc] = useState(null);
  const [cardBackImage, setCardBackImage] = useState(null);
  const [cardWidth, setCardWidth] = useState(120);
  const [cardHeight, setCardHeight] = useState(166);
  const [cardPadding, setCardPadding] = useState(40);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deckId = await fetchDeckId();
        const cardBackImage = await fetchCardBack();
        setCardBackImage(cardBackImage);
        setDeckId(deckId);
        setCardHeight(
          Math.floor((cardWidth * cardBackImage.height) / cardBackImage.width)
        );

        setError(null);
      } catch (err) {
        setError(err.message);
        setDeckId(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const draw = async () => {
    const { cardImageSrc, cardsRemaining } = await fetchCard(deckId);
    // console.log({ cardImageSrc, cardsRemaining });
    SetImageSrc(cardImageSrc);
    setCardsRemaining(cardsRemaining);
  };

  return (
    <>
      <div>
        {loading && <h1>Marvin is loading</h1>}
        {error && <h1>Marvin has encountered an error</h1>}

        {/* Remove this img! */}
        <img
          onClick={draw}
          src={reactLogo}
          className="logo react"
          alt="React logo"
        />
        <Canvas
          imageSrc={imageSrc}
          cardBackImage={cardBackImage}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          cardPadding={cardPadding}
        />
      </div>
      <p>{cardsRemaining} cards remaining</p>
    </>
  );
}

export default App;
