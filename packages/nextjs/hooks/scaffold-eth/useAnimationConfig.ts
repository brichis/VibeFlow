import { useMemo } from "react";

export const useAnimationConfig = () => {
  const animationConfig = useMemo(() => ({
    duration: 200,
    easing: "ease-in-out",
  }), []);

  return animationConfig;
};
