import { useRef, useEffect, useState, startTransition } from "react";

export default function Canvas({
  imageSrc,
  cardBackImage,
  cardWidth,
  cardPadding,
  cardHeight,
}) {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [lastCard, setLastCard] = useState(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
  }, []);

  useEffect(() => {
    if (!context) return;
    //initial board setup  - add back of card and turn first card... so maybe put in useEffect below with context dependency?

    context.fillStyle = "green";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }, [context]);

  useEffect(() => {
    // TODO - pass cardWidth etc as props to define canvas size
    // TODO - Hold 'last card' image and render on rhs if exists
    const cardTurnTime = 800;
    const cardPauseTime = 200;
    const cardMoveTime = 400;

    const zFactor = 0.1;
    let start;
    let animationFrameId;
    const image = new Image();
    image.src = imageSrc;
    if (image.src) {
      image.onload = () => {
        const animateCard = (timestamp) => {
          if (start === undefined) {
            start = timestamp;
          }
          const elapsed = timestamp - start;
          context.fillStyle = "green";
          context.fillRect(0, 0, context.canvas.width, context.canvas.height);
          context.drawImage(
            cardBackImage,
            cardPadding,
            cardPadding,
            cardWidth,
            cardHeight
          );
          if (lastCard) {
            context.drawImage(
              lastCard,
              2 * cardPadding + cardWidth,
              cardPadding,
              cardWidth,
              cardHeight
            );
          }
          if (elapsed < cardTurnTime) {
            const stepDistance = Math.floor(
              (elapsed / cardTurnTime) * cardWidth
            );

            if (stepDistance < cardWidth / 2) {
              const heightMultiplier = (stepDistance / cardWidth) * zFactor;
              for (let i = 0; i <= cardBackImage.width; i++) {
                context.drawImage(
                  cardBackImage,
                  i,
                  0,
                  1,
                  cardBackImage.height,
                  cardPadding +
                    ((i * cardWidth) / cardBackImage.width) *
                      (1 - (2 * stepDistance) / cardWidth) +
                    stepDistance,
                  cardPadding - 1 * heightMultiplier * i,
                  1,
                  cardHeight + 2 * heightMultiplier * i
                );
              }
            } else {
              const heightMultiplier =
                (zFactor * (cardWidth - stepDistance)) / cardWidth;
              for (let i = 0; i <= image.width; i++) {
                context.drawImage(
                  image,
                  i,
                  0,
                  1,
                  image.height,
                  cardPadding +
                    cardWidth -
                    (((i * cardWidth) / image.width) *
                      (1 - (2 * stepDistance) / cardWidth) +
                      stepDistance),
                  cardPadding - 1 * heightMultiplier * (image.width - i),
                  1,
                  cardHeight + 2 * heightMultiplier * (image.width - i)
                );
              }
            }
          } else if (elapsed < cardTurnTime + cardPauseTime) {
            context.drawImage(
              image,
              cardPadding,
              cardPadding,
              cardWidth,
              cardHeight
            );
          } else if (elapsed < cardTurnTime + cardPauseTime + cardMoveTime) {
            const stepDistance = Math.floor(
              ((elapsed - cardTurnTime - cardPauseTime) / cardMoveTime) *
                (cardWidth + cardPadding)
            );
            context.drawImage(
              image,
              cardPadding + stepDistance,
              cardPadding,
              cardWidth,
              cardHeight
            );
          } else {
            context.drawImage(
              image,
              2 * cardPadding + cardWidth,
              cardPadding,
              cardWidth,
              cardHeight
            );

            setLastCard(image);
          }

          // else if (stepDistance > cardWidth * 2) {
          //   context.drawImage(image, cardPadding, 0, cardWidth, cardHeight);
          // } else {
          //   context.drawImage(
          //     image,
          //     cardPadding + stepDistance - cardWidth,
          //     0,
          //     cardWidth,
          //     cardHeight
          //   );
          // }
          if (elapsed < cardTurnTime + cardPauseTime + cardMoveTime) {
            animationFrameId = window.requestAnimationFrame(animateCard);
          }
        };
        requestAnimationFrame(animateCard);
      };
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [imageSrc]);

  return (
    <canvas
      ref={canvasRef}
      width={2 * cardWidth + 3 * cardPadding}
      height={cardHeight + 2 * cardPadding}
    />
  );
}
