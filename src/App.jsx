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
  const { height, width } = useWindowDimensions();
  const [animationSpeedIndex, setAnimationSpeedIndex] = useState(1);
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
      <Header>
        <button onClick={() => dialogRef.current?.showModal()}>
          click me!
        </button>
      </Header>

      <Scoreboard
        score={score}
        highScore={highScore}
        cardsRemaining={52 - drawnCards.length}
        animationActive={animationActive}
      />

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
          // animationSpeedIndex={animationSpeedIndex}
          animationSpeedData={animationSpeedData[animationSpeedIndex]}
        />
      </div>
      <ButtonDisplay
        gameInProgress={gameInProgress}
        onStartClick={handleStartClick}
        onHighLowClick={handleHighLowClick}
        animationActive={animationActive}
      />
      <dialog ref={dialogRef}>
        Options
        <form>
          <label>
            Animation Speed: {animationSpeedData[animationSpeedIndex].desc}
            <input
              type="range"
              min="0"
              max="2"
              value={animationSpeedIndex || 1}
              onChange={(e) => {
                setAnimationSpeedIndex(e.target.value);
              }}
            />
          </label>
        </form>
      </dialog>
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
{
  /* Display Options
  <form>
    <label>
      Card Size
      <input
        type="range"
        min="10"
        max={0.9 * 0.5 * (width - 3 * cardPadding)}
        value={cardWidth || "100"}
        onChange={(e) => {
          if (Math.abs(e.target.value - cardWidth) > 1) {
            setCardWidth(Math.floor(parseInt(e.target.value)));
            setCardHeight(
              Math.floor(
                (cardWidth * cardBackImage.height) / cardBackImage.width
              )
            );
          }
        }}
      />
    </label>
    <label>
      Padding Size
      <input
        type="range"
        min="5"
        max={0.9 * (1 / 3) * (width - 2 * cardWidth)}
        value={cardPadding || "20"}
        onChange={(e) => {
          console.log(height);
          setCardPadding(Math.floor(parseInt(e.target.value)));
        }}
      />
    </label>
  </form> */
}
