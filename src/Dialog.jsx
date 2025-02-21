import { forwardRef } from "react";
import { animationSpeedData } from "./config";

const Dialog = forwardRef(
  (
    {
      animationSpeedIndex,
      setAnimationSpeedIndex,
      cheatMode,
      setCheatMode,
      closeModal,
    },
    ref
  ) => {
    return (
      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            closeModal();
          }
        }}
      >
        <h4>Options</h4>
        <form>
          <label>
            Animation Speed: {animationSpeedData[animationSpeedIndex].desc}
            <input
              type="range"
              min="0"
              max="2"
              value={animationSpeedIndex || 1}
              onChange={(e) => {
                setAnimationSpeedIndex(e.target.value);
              }}
            />
          </label>

          <div>
            Cheat mode
            <label className="toggle">
              <input
                onChange={(e) => {
                  setCheatMode(!cheatMode);
                }}
                type="checkbox"
              />
              <span className="slider"></span>
            </label>
          </div>
        </form>
      </dialog>
    );
  }
);

export { Dialog };
