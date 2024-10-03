import { Fragment } from "react";
import styles from "../styles/Components.module.css";
import type { SpeedSliderProps } from "../types";

const SpeedSlider = ({ onChange, currentSpeed }: SpeedSliderProps) => {
  // JSX to render
  return (
    <Fragment>
      <div className={styles.speedSlider}>
        <p>50 wpm</p>
        <input
          type={"range"}
          min={50}
          max={750}
          value={currentSpeed}
          onChange={(event) => {
            const numberValue = parseInt(event.target.value);
            onChange(numberValue);
          }}
        />
        <p>750 wpm</p>
      </div>
      <div className={styles.flexCenter}>
        {currentSpeed} wpm
      </div>
    </Fragment>
  );
}

export default SpeedSlider;