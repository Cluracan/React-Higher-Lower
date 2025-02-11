export function HighLowButtons({ onClick, animationActive }) {
  return (
    <div>
      <button disabled={animationActive} onClick={() => onClick("high")}>
        Higher
      </button>
      <button disabled={animationActive} onClick={() => onClick("low")}>
        Lower
      </button>
    </div>
  );
}

export function StartButton({ onClick }) {
  return <button onClick={onClick}>Start</button>;
}
