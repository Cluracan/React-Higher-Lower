export default function Header({ onClick, marvinMessage, animationActive }) {
  return (
    <div className="header">
      <img onClick={onClick} src="./marvin.svg" />

      <p>{animationActive ? "..." : marvinMessage}</p>
    </div>
  );
}
