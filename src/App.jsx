import { useState, useEffect } from "react";
import fetchDeckData from "./DeckOfCardsAPI";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <>
      <div>
        {loading && <h1>Marvin is loading</h1>}
        {error && <h1>Marvin has encountered an error</h1>}
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
    </>
  );
}

export default App;
