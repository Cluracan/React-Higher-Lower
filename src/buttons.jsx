export function HighLowButtons() {
  return (
    <div>
      <button>Higher</button>
      <button>Lower</button>
    </div>
  );
}

export function StartButton({ onClick }) {
  return <button onClick={onClick}>Start</button>;
}
