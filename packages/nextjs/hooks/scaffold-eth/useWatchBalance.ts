import { useState } from "react";

export const useWatchBalance = () => {
  const [balance, setBalance] = useState<string>("0");

  return { balance };
};
