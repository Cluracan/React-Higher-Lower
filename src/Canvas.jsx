import { useRef, useEffect, useState } from "react";
import {
  cardFlipHeightFactor,
  cardPadding,
  defaultCardWidth,
  defaultCardHeight,
} from "./config";
import useWindowDimensions from "../Hooks/UseWindowDimensions";

export default function Canvas({
  imageSrc,
  setAnimationActive,
  animationSpeedData,
}) {
  const canvasRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [context, setContext] = useState(null);
  const [lastCard, setLastCard] = useState(null);
  const [cardWidth, setCardWidth] = useState(defaultCardWidth);
  const { cardTurnTime, cardPauseTime, cardMoveTime } = animationSpeedData;
  const [cardBackImage, setCardBackImage] = useState(null);
  const [cardAspectRatio, setCardAspectRatio] = useState(null);
  const [pixel, setPixel] = useState(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
    const cardBackImg = new Image();
    cardBackImg.src = "./cardBack.png";
    cardBackImg.onload = () => {
      let newCardWidth;
      let newCardAspectRatio = cardBackImg.height / cardBackImg.width;
      setCardAspectRatio(newCardAspectRatio);

      if (width < 0.9 * defaultCardWidth * 2 + cardPadding * 3) {
        newCardWidth = Math.round((0.9 * width - cardPadding * 3) / 2);
      } else {
        newCardWidth = defaultCardWidth;
      }
      setCardWidth(newCardWidth);

      ctx.drawImage(
        cardBackImg,
        2 * cardPadding + newCardWidth,
        cardPadding,
        newCardWidth,
        newCardWidth * newCardAspectRatio
      );

      setCardBackImage(cardBackImg);
    };
    ctx.fillStyle = "green";
    ctx.fillRect(50, 50, 200, 200);

    setPixel(window.devicePixelRatio);
  }, [width]);

  useEffect(() => {
    if (!context) {
      return;
    }
    if (cardBackImage) {
      context.drawImage(
        cardBackImage,
        2 * cardPadding + cardWidth,
        cardPadding,
        cardWidth,
        cardWidth * cardAspectRatio
      );
    }
    context.fillStyle = "pink";
    context.fillRect(50, 50, 200, 200);
  }, [cardWidth, cardBackImage]);

  useEffect(() => {
    if (imageSrc === null && context) {
      setLastCard(null);
      return;
    }

    //If resizing frame, no change to image
    if (imageSrc === lastCard?.src) {
      context.drawImage(
        cardBackImage,
        2 * cardPadding + cardWidth,
        cardPadding,
        cardWidth,
        cardWidth * cardAspectRatio
      );

      context.drawImage(
        lastCard,
        cardPadding,
        cardPadding,
        cardWidth,
        cardWidth * cardAspectRatio
      );
      context.fillStyle = "pink";
      context.fillRect(50, 50, 200, 200);
      return;
    }

    setAnimationActive(true);
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

          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          context.drawImage(
            cardBackImage,
            2 * cardPadding + cardWidth,
            cardPadding,
            cardWidth,
            cardWidth * cardAspectRatio
          );
          if (lastCard) {
            context.drawImage(
              lastCard,
              cardPadding,
              cardPadding,
              cardWidth,
              cardWidth * cardAspectRatio
            );
          }
          if (elapsed < cardTurnTime) {
            const stepDistance = Math.floor(
              (elapsed / cardTurnTime) * cardWidth
            );

            if (stepDistance < cardWidth / 2) {
              const heightMultiplier =
                (stepDistance / cardWidth) * cardFlipHeightFactor;
              for (let i = 0; i <= cardBackImage.width; i++) {
                context.drawImage(
                  cardBackImage,
                  i,
                  0,
                  1,
                  cardBackImage.height,
                  2 * cardPadding +
                    cardWidth +
                    ((i * cardWidth) / cardBackImage.width) *
                      (1 - (2 * stepDistance) / cardWidth) +
                    stepDistance,
                  cardPadding - 1 * heightMultiplier * i,
                  1,
                  cardWidth * cardAspectRatio + 2 * heightMultiplier * i
                );
              }
            } else {
              const heightMultiplier =
                (cardFlipHeightFactor * (cardWidth - stepDistance)) / cardWidth;
              for (let i = 0; i <= image.width; i++) {
                context.drawImage(
                  image,
                  i,
                  0,
                  1,
                  image.height,
                  2 * cardPadding +
                    cardWidth +
                    cardWidth -
                    (((i * cardWidth) / image.width) *
                      (1 - (2 * stepDistance) / cardWidth) +
                      stepDistance),
                  cardPadding - 1 * heightMultiplier * (image.width - i),
                  1,
                  cardWidth * cardAspectRatio +
                    2 * heightMultiplier * (image.width - i)
                );
              }
            }
          } else if (elapsed < cardTurnTime + cardPauseTime) {
            context.drawImage(
              image,
              2 * cardPadding + cardWidth,
              cardPadding,
              cardWidth,
              cardWidth * cardAspectRatio
            );
          } else if (elapsed < cardTurnTime + cardPauseTime + cardMoveTime) {
            const stepDistance = Math.floor(
              ((elapsed - cardTurnTime - cardPauseTime) / cardMoveTime) *
                (cardWidth + cardPadding)
            );
            context.drawImage(
              image,
              2 * cardPadding + cardWidth - stepDistance,
              cardPadding,
              cardWidth,
              cardWidth * cardAspectRatio
            );
          } else {
            context.drawImage(
              image,
              cardPadding,
              cardPadding,
              cardWidth,
              cardWidth * cardAspectRatio
            );

            setLastCard(image);
            setAnimationActive(false);
          }

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
  }, [imageSrc, cardWidth]);

  return (
    <>
      <p>{pixel}</p>
      <canvas
        // style={{ background: "green" }}

        ref={canvasRef}
        width={600}
        height={400}
      />
    </>
  );
}
