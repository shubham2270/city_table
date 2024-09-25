import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";

const SearchBox = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const inputRef = useRef(null); // Reference to input field

  // Handle keyboard shortcut for Ctrl + /
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "/") {
        event.preventDefault();
        inputRef?.current?.focus(); // Focus on input field
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles["search-box-container"]}>
      <input
        ref={inputRef}
        type="text"
        disabled={isDisabled}
        placeholder="Search..."
        className={styles["search-box-input"]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <div className={styles["search-box-shortcut"]}>Ctrl + /</div>
    </div>
  );
};

export default SearchBox;
