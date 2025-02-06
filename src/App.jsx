import { useState, useEffect } from "react";
import fetchDeckData from "./FetchDeck";
import reactLogo from "./assets/react.svg";
import Canvas from "./Canvas";
import "./App.css";

const imageArray = [
  "https://deckofcardsapi.com/static/img/JC.png",
  "https://deckofcardsapi.com/static/img/QC.png",
  "https://deckofcardsapi.com/static/img/KC.png",
];

function App() {
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageSrc, SetImageSrc] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deckArray = await fetchDeckData();
        setDeck(deckArray);
        console.log(deckArray);
        setError(null);
      } catch (err) {
        setError(err.message);
        setDeck(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //TODO - Remove this:
  function handleShowDeck() {
    setImageIndex((imageIndex + 1) % 3);
  }

  const draw = () => {
    SetImageSrc(imageArray[imageIndex]);
    setImageIndex((imageIndex + 1) % 3);
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
        <Canvas imageSrc={imageSrc} />
      </div>
    </>
  );
}

export default App;
