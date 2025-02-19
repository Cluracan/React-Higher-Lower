export default function Header({ children }) {
  return (
    <div className="header">
      <img src="./marvin.svg" />
      Header
      {children}
    </div>
  );
}
