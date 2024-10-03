import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../styles/Reader.module.css";

const Home: NextPage = () => {
  const router = useRouter();

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [text, setText] = useState<string[]>([]);
  const [previousWord, setPreviousWord] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [nextWord, setNextWord] = useState("");

  // Load settings
  const isWindowDefined = typeof window;
  useEffect(() => {
    const text = window.localStorage.getItem("text");
    const speed = Number(window.localStorage.getItem("speed"));
    const startedAt = Number(window.localStorage.getItem("startedAt"));

    // If one or more settings is invalid, go back to the start screen
    if (!text || !speed || isNaN(speed) || !startedAt || isNaN(startedAt) || Date.now() - startedAt > 60 * 60 * 1000) {
      router.replace("/");
      return;
    }

    setText(
      text.split("\n").join(" ")
        .split(" ").filter((word) => word !== "")
    );
    setSpeed(speed);
    setIsLoading(false);

  }, [isWindowDefined, router]);

  // Interval for the reading
  useEffect(() => {
    let nextWordAt = Date.now();
    let countdownAt = 3;

    const interval = setInterval(() => {
      if (Date.now() < nextWordAt) return;

      // Start/stop timer
      if (countdownAt >= 0) {
        setPreviousWord((countdownAt+1).toString());
        setCurrentWord(countdownAt === 0 ? text[0] : countdownAt.toString());
        setNextWord(countdownAt === 0 ? text[1] : countdownAt === 1 ? text[0] : (countdownAt-1).toString());
        countdownAt--;
        nextWordAt = (countdownAt < 1) ? (Date.now() + ((60/speed)*1000)) : (Date.now() + 1000);

        return;
      }

      // Set display
      setPreviousWord(text.shift() || "");
      setCurrentWord(text[0]);
      setNextWord(text[1]);
      nextWordAt = Date.now() + ((60/speed)*1000);
    }, 10);
    return () => clearInterval(interval);
  }, [text, speed]);

  // JSX to render
  return (
    <>
      {isLoading ? (
        <div className={styles.loadContainer}>
          <h1>Loading...</h1>
        </div>
      ) : previousWord !== "" ? (
        <div className={styles.container}>
          <h1 className={styles.previousWord}>{previousWord}</h1>
          <h1 className={styles.currentWord}>{currentWord}</h1>
          <h1 className={styles.nextWord}>{nextWord}</h1>
        </div>
      ) : (
        <div className={styles.loadContainer}>
          <h1>You&apos;re done!</h1>
        </div>
      )}
    </>
  );
}

export default Home;
