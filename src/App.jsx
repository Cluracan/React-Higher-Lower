import { useState, useEffect } from "react";
import {
  fetchCard,
  fetchDeckId,
  fetchCardBack,
  shuffleDeck,
} from "./DeckOfCardsAPI";
import { HighLowButtons, StartButton } from "./buttons";
import Scoreboard from "./Scoreboard";
import Canvas from "./Canvas";
import { useExternalStorage } from "./useExternalStorage";
import "./App.css";

function App() {
  const [deckId, setDeckId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageSrc, SetImageSrc] = useState(null);
  const [cardBackImage, setCardBackImage] = useState(null);
  const [cardWidth, setCardWidth] = useState(120);
  const [cardHeight, setCardHeight] = useState(166);
  const [cardPadding, setCardPadding] = useState(40);
  const [animationActive, setAnimationActive] = useState(true);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [drawnCards, setDrawnCards] = useState([]);
  const [score, setScore] = useState(0);
  const highScore = useExternalStorage();
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
        setAnimationActive(false);
      }
    };
    fetchData();
  }, []);

  const drawCard = async () => {
    if (!animationActive) {
      const { cardImageSrc, cardValue, cardsRemaining } = await fetchCard(
        deckId
      );
      SetImageSrc(cardImageSrc);
      setDrawnCards([...drawnCards, cardValue]);

      return cardValue;
    }
  };

  const handleHighLowClick = async (prediction) => {
    const curCard = await drawCard();
    const lastCard = drawnCards[drawnCards.length - 1];
    if (
      (prediction === "high" && curCard > lastCard) ||
      (prediction === "low" && curCard < lastCard)
    ) {
      setScore(score + 1);
    } else {
      console.log("lose");
      if (score > highScore) {
        localStorage.setItem("high-score", score);
      }
      setScore(0);
      setGameInProgress(false);
      setDrawnCards([]);
      shuffleDeck(deckId);
    }
  };

  const handleStartClick = async () => {
    if (!animationActive) {
      SetImageSrc(null);
      await drawCard();
      setGameInProgress(true);
    }
  };

  return (
    <>
      <div>
        {loading && <h1>Marvin is loading</h1>}
        {error && <h1>Marvin has encountered an error</h1>}
        <Canvas
          imageSrc={imageSrc}
          cardBackImage={cardBackImage}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          cardPadding={cardPadding}
          setAnimationActive={setAnimationActive}
        />
        {!gameInProgress && <StartButton onClick={handleStartClick} />}
        {gameInProgress && (
          <HighLowButtons
            onClick={handleHighLowClick}
            animationActive={animationActive}
          />
        )}
      </div>
      <p>{52 - drawnCards.length} cards remaining</p>
      <p>drawn cards {drawnCards}</p>
      <p> animation active: {animationActive ? "true" : "false"}</p>
      <Scoreboard score={score} highScore={highScore} />
    </>
  );
}

export default App;
