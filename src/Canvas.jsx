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
  cardBackImage,
  setAnimationActive,
  animationSpeedData,
}) {
  const canvasRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [context, setContext] = useState(null);
  const [lastCard, setLastCard] = useState(null);
  const [cardWidth, setCardWidth] = useState(defaultCardWidth);
  const [cardHeight, setCardHeight] = useState(defaultCardHeight);
  const { cardTurnTime, cardPauseTime, cardMoveTime } = animationSpeedData;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);

    if (cardBackImage) {
      const cardAspectRatio = cardBackImage.height / cardBackImage.width;
      if (width < 0.9 * defaultCardWidth * 2 + cardPadding * 3) {
        let newCardWidth = Math.floor((0.9 * width - cardPadding * 3) / 2);
        let newCardHeight = Math.floor(newCardWidth * cardAspectRatio);
        setCardWidth(newCardWidth);
        setCardHeight(newCardHeight);
      } else {
        setCardHeight(Math.floor(cardWidth * cardAspectRatio));
      }
    }
  }, [cardBackImage, width]);

  useEffect(() => {
    if (!context) {
      console.log("NO CONTEXT");
      return;
    }
    if (cardBackImage) {
      context.drawImage(
        cardBackImage,
        2 * cardPadding + cardWidth,
        cardPadding,
        cardWidth,
        cardHeight
      );
    }
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
        cardHeight
      );

      context.drawImage(
        lastCard,
        cardPadding,
        cardPadding,
        cardWidth,
        cardHeight
      );
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
            cardHeight
          );
          if (lastCard) {
            context.drawImage(
              lastCard,
              cardPadding,
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
                  cardHeight + 2 * heightMultiplier * i
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
                  cardHeight + 2 * heightMultiplier * (image.width - i)
                );
              }
            }
          } else if (elapsed < cardTurnTime + cardPauseTime) {
            context.drawImage(
              image,
              2 * cardPadding + cardWidth,
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
              2 * cardPadding + cardWidth - stepDistance,
              cardPadding,
              cardWidth,
              cardHeight
            );
          } else {
            context.drawImage(
              image,
              cardPadding,
              cardPadding,
              cardWidth,
              cardHeight
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
    <canvas
      // style={{ background: "green" }}

      ref={canvasRef}
      width={2 * cardWidth + 3 * cardPadding}
      height={cardHeight + 2 * cardPadding}
    />
  );
}
