export default function Scoreboard({ score, highScore }) {
  return (
    <div>
      <p>Current Score: {score}</p>
      <p>Highscore: {highScore}</p>
    </div>
  );
}
