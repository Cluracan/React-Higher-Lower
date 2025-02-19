export default function Scoreboard({ score, highScore, cardsRemaining }) {
  return (
    <div className="scoreboard">
      <p>Current Score: {score}</p>
      <p>High score: {highScore}</p>
      <p>Cards Remaining: {cardsRemaining}</p>
    </div>
  );
}
