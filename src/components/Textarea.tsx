import styles from "../styles/Components.module.css";
import type { TextareaProps } from "../types";

const Textarea = ({ onChange, value }: TextareaProps) => {
  // JSX to render
  return (
    <div className={styles.flexCenter}>
      <textarea
        className={styles.textarea}
        placeholder={"Paste your text here"}
        spellCheck={false}
        onChange={onChange}
        value={value}
        maxLength={1000000}
      />
    </div>
  );
};

export default Textarea;