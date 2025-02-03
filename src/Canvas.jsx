import { useRef, useEffect } from "react";

export default function Canvas({ draw }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "green";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    draw(context);
  });

  return <canvas ref={canvasRef} />;
}
