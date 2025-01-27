import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //TODO -----extract the async function into a separate file (keep try catch here), and add logic to convert value from JACK->11 etc, also parseInt numbers!!!
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://deckofcardsapi.com/api/deck/new/draw/?count=52"
        );
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const deckData = await response.json();
        const deckArray = deckData.cards.map((data) => {
          return { value: data.value, image: data.images.svg };
        });
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
