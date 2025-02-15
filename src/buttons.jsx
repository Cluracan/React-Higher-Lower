export function HighLowButtons({ onClick, animationActive, highLow }) {
  return (
    <>
      <button
        style={{ margin: "1rem" }}
        disabled={animationActive}
        onClick={() => onClick(highLow)}
      >
        {highLow}
      </button>
    </>
  );
}

export function StartButton({ onClick, animationActive }) {
  return (
    <button
      disabled={animationActive}
      style={{ margin: "1rem" }}
      onClick={onClick}
    >
      Start
    </button>
  );
}
