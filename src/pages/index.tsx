import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import SpeedSlider from "../components/SpeedSlider";
import Textarea from "../components/Textarea";
import styles from "../styles/Home.module.css";

// TODO: Add testing! https://nextjs.org/docs/testing

const Home: NextPage = () => {
  const router = useRouter();

  // States
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(200);

  // Load from previous session
  const isWindowDefined = typeof window;
  useEffect(() => {
    const text = window.localStorage.getItem("text");
    const speed = Number(window.localStorage.getItem("speed"));

    if (!text || !speed || isNaN(speed)) return;

    setText(text);
    setSpeed(speed);

  }, [isWindowDefined, router]);

  // Changes
  function onTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
    window.localStorage.setItem("text", event.target.value);
  }
  function onPdfDrop(value: string) {
    setText(value);
    window.localStorage.setItem("text", value);
  }
  function onSpeedChange(newSpeed: number) {
    setSpeed(newSpeed);
    window.localStorage.setItem("speed", newSpeed.toString());
  }

  // Pdf.js is large, so we load the pdf drag-and-drop place dynamically
  const DynamicPdfDrop = dynamic(() => import("../components/PdfDrop"), {
    ssr: false
  });

  // Button to get started!
  function start(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    window.localStorage.setItem("text", text);
    window.localStorage.setItem("speed", speed.toString());
    window.localStorage.setItem("startedAt", Date.now().toString());
    router.push("/reader");
  }

  // JSX to render
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Fast reading</h1>
        <p>Start reading your texts even faster!</p>
      </div>

      <div className={styles.content}>
        <h2>How does it work?</h2>
        <p>When reading, we spend a lot of time moving our eyes. By removing that time, you can read much faster!</p>
        <p>This website displays the words you want to read in the middle of the screen. By providing context (the previous and next word), you can read texts faster while still understanding the text! And the best thing: nothing will ever leave your device, including pdf documents and texts!</p>
        <p>Warning: Fast reading isn&apos;t meant to help you read texts thoroughly, just faster!</p>

        <h2>Let&apos;s get started!</h2>
        <h3>1. Add your text</h3>
        <div className={styles.sideBySide}>
          <div>
            <h4>Paste your text</h4>
            <p>Use the text box below to paste your text.</p>
            <Textarea
              onChange={onTextareaChange}
              value={text}
            />
          </div>
          <div>
            <h4>Upload a pdf document</h4>
            <p>Drag-and-drop a pdf document (or click) inside this field. This will replace the existing text.</p>
            <Suspense fallback={"Loading..."}>
              <DynamicPdfDrop onChange={onPdfDrop} />
            </Suspense>
            {/* <PdfDrop
              onChange={onPdfDrop}
            /> */}
          </div>
        </div>

        <h3>2. Select your speed</h3>
        <p>Use the silder to set the right speed. Fastreading changes the time you can see a word depending on the length of that world. The speed you provide here is for 5 letter words (the average) in the English language.</p>
        <SpeedSlider
          currentSpeed={speed}
          onChange={onSpeedChange}
        />

        <h3>3. Start reading</h3>
        <p>Click the button below to start reading! You can always pause and continue by clicking on the space bar or tapping the screen (on mobile).</p>
        <div className={styles.flexCenter}>
          <button className={styles.button} onClick={start}>Start!</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
