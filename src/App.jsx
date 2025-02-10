import { useState, useEffect } from "react";
import { fetchCard, fetchDeckId, fetchCardBack } from "./DeckOfCardsAPI";
import { HighLowButtons, StartButton } from "./buttons";
import reactLogo from "./assets/react.svg";
import Canvas from "./Canvas";
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

  const draw = async () => {
    if (!animationActive) {
      const { cardImageSrc, cardValue } = await fetchCard(deckId);
      SetImageSrc(cardImageSrc);
      setDrawnCards([...drawnCards, cardValue]);
    }
  };

  const handleStartClick = () => {
    //check full deck? or only display if game over and deck reloaded?
    draw();
    //don't use draw (assuming draw will check value against old (or maybe include lastCard nullcheck so mightbe ok))
    setGameInProgress(true);
  };

  //SEEM TO HAVE GOT SETANIMATIONACTIVE WORKING AS PROP - just keeping in for a bit
  // const onStartAnimation = () => {
  //   //think this is ok? it is an anonymous 'handleStartAnimation' - or maybe should be handle anyway as the event is not listened for explicitly
  //   setAnimationActive(true);
  // };

  // const onEndAnimation = () => {
  //   setAnimationActive(false);
  // };

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
          // onStartAnimation={onStartAnimation}
          // onEndAnimation={onEndAnimation}
          setAnimationActive={setAnimationActive}
        />
        {!gameInProgress && <StartButton onClick={handleStartClick} />}
        {gameInProgress && <HighLowButtons />}
      </div>
      <p>{52 - drawnCards.length} cards remaining</p>
      <p>drawn cards {drawnCards}</p>
      <p> animation active: {animationActive ? "true" : "false"}</p>
    </>
  );
}

export default App;
