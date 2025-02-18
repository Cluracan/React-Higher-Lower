import { forwardRef } from "react";
import { animationSpeedData } from "./config";

const Dialog = forwardRef(
  (
    { animationSpeedIndex, setAnimationSpeedIndex, cheatMode, setCheatMode },
    ref
  ) => {
    return (
      <dialog ref={ref}>
        Options
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
