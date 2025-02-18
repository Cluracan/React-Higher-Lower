import { HighLowButtons, StartButton } from "./buttons";

export function ButtonDisplay({
  onStartClick,
  onHighLowClick,
  animationActive,
  gameInProgress,
  cheatMode,
}) {
  if (gameInProgress) {
    return (
      <div className="button-holder">
        <HighLowButtons
          onClick={onHighLowClick}
          animationActive={animationActive}
          highLow={"Higher"}
        />
        <HighLowButtons
          onClick={onHighLowClick}
          animationActive={animationActive}
          highLow={"Lower"}
        />
        cheatMode: {cheatMode ? "ON" : "OFF"}
      </div>
    );
  } else {
    return (
      <StartButton onClick={onStartClick} animationActive={animationActive} />
    );
  }
}
