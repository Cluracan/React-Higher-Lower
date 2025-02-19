import { HighLowButtons, StartButton } from "./buttons";

export function ButtonDisplay({
  onStartClick,
  onHighLowClick,
  animationActive,
  gameInProgress,

  cardProbability,
}) {
  if (gameInProgress) {
    return (
      <div className="button-holder">
        <HighLowButtons
          onClick={onHighLowClick}
          animationActive={animationActive}
          highLow={"Higher"}
          cardProbability={cardProbability?.highChance}
        />
        <HighLowButtons
          onClick={onHighLowClick}
          animationActive={animationActive}
          highLow={"Lower"}
          cardProbability={cardProbability?.lowChance}
        />
      </div>
    );
  } else {
    return (
      <div className="button-holder">
        <StartButton onClick={onStartClick} animationActive={animationActive} />
      </div>
    );
  }
}
