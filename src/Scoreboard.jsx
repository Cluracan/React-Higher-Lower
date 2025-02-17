export default function Scoreboard({
  score,
  highScore,
  cardsRemaining,
  animationActive,
}) {
  return (
    <div className="scoreboard">
      <p>Current Score: {score}</p>
      <p>High score: {highScore}</p>
      <p>Cards Remaining: {cardsRemaining}</p>
      <p>Animation Active: {animationActive ? "True" : "False"}</p>
    </div>
  );
}
