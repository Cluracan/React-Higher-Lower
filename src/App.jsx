import { useState, useEffect, useRef } from "react";
import {
  fetchCard,
  fetchDeckId,
  fetchCardBack,
  shuffleDeck,
} from "./DeckOfCardsAPI";

import Scoreboard from "./Scoreboard";
import Canvas from "./Canvas";
import { useExternalStorage } from "./useExternalStorage";
import "./App.css";
import { ButtonDisplay } from "./buttonHolder";

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
  const dialogRef = useRef(null);
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
      const { cardImageSrc, cardValue } = await fetchCard(deckId);
      SetImageSrc(cardImageSrc);
      setDrawnCards([...drawnCards, cardValue]);

      return cardValue;
    }
  };

  const handleHighLowClick = async (prediction) => {
    const curCard = await drawCard();
    const lastCard = drawnCards[drawnCards.length - 1];
    if (
      (prediction === "Higher" && curCard > lastCard) ||
      (prediction === "Lower" && curCard < lastCard)
    ) {
      setScore(score + 1);
    } else {
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
      <button onClick={() => dialogRef.current?.showModal()}>click me!</button>
      <div className="scoreboard">
        <p>{52 - drawnCards.length} cards remaining</p>
        <p>drawn cards {drawnCards}</p>
        <p> animation active: {animationActive ? "true" : "false"}</p>
        <Scoreboard score={score} highScore={highScore} />
      </div>
      <div className="canvas">
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
      </div>
      <ButtonDisplay
        gameInProgress={gameInProgress}
        onStartClick={handleStartClick}
        onHighLowClick={handleHighLowClick}
        animationActive={animationActive}
      />
      <dialog ref={dialogRef}>
        I am a dialog
        <form>
          <label>
            Card Size
            <input
              type="range"
              min="10"
              max="200"
              value={cardWidth || "100"}
              onChange={(e) => {
                setCardWidth(Math.floor(parseInt(e.target.value)));
                setCardHeight(
                  Math.floor(
                    (cardWidth * cardBackImage.height) / cardBackImage.width
                  )
                );
              }}
            ></input>
          </label>
        </form>
      </dialog>
    </>
  );
}

export default App;
