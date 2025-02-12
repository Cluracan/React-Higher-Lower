import { useSyncExternalStore } from "react";

export function useExternalStorage() {
  const highScore = useSyncExternalStore(subscribe, getSnapshot);
  return highScore;
}

function getSnapshot() {
  let result = parseInt(localStorage.getItem("high-score"));
  return result || 0;
}

function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
}
