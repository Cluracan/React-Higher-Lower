import { useRef, useEffect } from "react";

export default function Canvas({ imageSrc }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "green";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    const image = new Image();
    image.src = imageSrc;
    if (image.src) {
      image.onload = () => {
        context.drawImage(image, 0, 0, 90, 130);
      };
    }
  }, [imageSrc]);

  return <canvas ref={canvasRef} />;
}
