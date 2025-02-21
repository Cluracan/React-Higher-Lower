import { useState, useEffect, useRef } from "react";
import {
  fetchCard,
  fetchDeckId,
  fetchCardBack,
  shuffleDeck,
} from "./DeckOfCardsAPI";
import { animationSpeedData } from "./config";
import Scoreboard from "./Scoreboard";
import Canvas from "./Canvas";
import { useExternalStorage } from "../Hooks/useExternalStorage";
import "./App.css";
import { ButtonDisplay } from "./ButtonHolder";
import useWindowDimensions from "../Hooks/UseWindowDimensions";
import Header from "./Header";
import { Dialog } from "./Dialog";

const calculateHighLowProbabilities = (usedCards) => {
  if (!usedCards) return null;
  const currentCard = usedCards[usedCards.length - 1];
  const usedLowerCardCount = usedCards.filter(
    (card) => card < currentCard
  ).length;
  const usedHigherCardCount = usedCards.filter(
    (card) => card > currentCard
  ).length;
  const remainingCardCount = 52 - usedCards.length;
  let remainingHigherCardCount = (13 - currentCard) * 4 - usedHigherCardCount;
  let remainingLowerCardCount = (currentCard - 1) * 4 - usedLowerCardCount;
  if (remainingHigherCardCount < 0) {
    remainingHigherCardCount = 0;
  }
  if (remainingLowerCardCount < 0) {
    remainingLowerCardCount = 0;
  }

  return {
    highChance: Math.round(
      (remainingHigherCardCount / remainingCardCount) * 100
    ),
    lowChance: Math.round((remainingLowerCardCount / remainingCardCount) * 100),
  };
};

function App() {
  const [deckId, setDeckId] = useState(null);
  const [error, setError] = useState(null);
  const [imageSrc, SetImageSrc] = useState(null);

  const [animationActive, setAnimationActive] = useState(true);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [drawnCards, setDrawnCards] = useState([]);
  const [score, setScore] = useState(0);
  const highScore = useExternalStorage();
  const dialogRef = useRef(null);
  const [animationSpeedIndex, setAnimationSpeedIndex] = useState(1);
  const [cheatMode, setCheatMode] = useState(false);
  const [highLowProbability, setHighLowProbability] = useState(null);
  const [marvinMessage, setMarvinMessage] = useState({ type: "loading" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deckId = await fetchDeckId();

        setDeckId(deckId);

        setError(null);
      } catch (err) {
        setError(err.message);
        setDeckId(null);
      } finally {
        setMarvinMessage({ type: "start" });
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
      setHighLowProbability(
        calculateHighLowProbabilities([...drawnCards, cardValue])
      );
      return cardValue;
    }
  };

  const handleHighLowClick = async (prediction) => {
    const curCard = await drawCard();
    const lastCard = drawnCards[drawnCards.length - 1];
    setMarvinMessage({ type: "prediction", prediction, lastCard });
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
    setMarvinMessage({ type: "reset" });
    if (!animationActive) {
      SetImageSrc(null);
      await drawCard();
      setGameInProgress(true);
    }
  };

  return (
    <>
      <Header
        animationActive={animationActive}
        marvinMessage={marvinMessage}
        gameInProgress={gameInProgress}
        onClick={() => dialogRef.current?.showModal()}
      ></Header>
      <main>
        <Scoreboard
          score={score}
          highScore={highScore}
          cardsRemaining={52 - drawnCards.length}
        />

        <div className="canvas">
          {error && <h1>Marvin has encountered an error</h1>}
          <Canvas
            imageSrc={imageSrc}
            setAnimationActive={setAnimationActive}
            animationSpeedData={animationSpeedData[animationSpeedIndex]}
          />
        </div>
        <ButtonDisplay
          gameInProgress={gameInProgress}
          onStartClick={handleStartClick}
          onHighLowClick={handleHighLowClick}
          animationActive={animationActive}
          cardProbability={cheatMode ? highLowProbability : null}
        />
        <Dialog
          ref={dialogRef}
          animationSpeedIndex={animationSpeedIndex}
          setAnimationSpeedIndex={setAnimationSpeedIndex}
          cheatMode={cheatMode}
          setCheatMode={setCheatMode}
        />
      </main>
      <footer>2025</footer>
    </>
  );
}

export default App;

/*

.
.
.
.

*/
