function getCard(value) {
  return [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
  ][value - 1];
}

export default function Header({
  onClick,
  marvinMessage,
  animationActive,
  gameInProgress,
}) {
  function getMessage() {
    switch (marvinMessage.type) {
      case "loading":
        return "Marvin is loading...";
      case "start":
        return "Welcome to the game! Click me for options.";
      case "reset":
        return "OK, good luck!";
      case "prediction":
        if (animationActive) {
          return `${marvinMessage.prediction} than a ${getCard(
            marvinMessage.lastCard
          )}...`;
        } else {
          return gameInProgress ? "Yes! Still in the game!" : "Ooooh! Unlucky!";
        }
      default:
        console.log(marvinMessage);
        return "Uh oh - something has gone wrong";
    }
  }

  return (
    <div className="header">
      <img onClick={onClick} src="./marvin.svg" />
      <p>{getMessage()}</p>
    </div>
  );
}
