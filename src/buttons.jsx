export function HighLowButtons({ onClick }) {
  return (
    <div>
      <button onClick={() => onClick("high")}>Higher</button>
      <button onClick={() => onClick("low")}>Lower</button>
    </div>
  );
}

export function StartButton({ onClick }) {
  return <button onClick={onClick}>Start</button>;
}
