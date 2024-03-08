import {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import { questions } from "../config";
import "./App.css";
import { Letter } from "./Letter";
import { anagramize } from "./anagramize";
import { wordDetails } from "./wordDetails";
import { ShuffleIcon } from "./shuffle";

/**
 * TODOs:
 * - [ ] Refactor everything
 * - [ ] Add shuffle
 * - [x] Add dots under selected letters
 * - [ ] Don't count solved letters
 * - [ ] Add a info button explaining the game
 * - [ ] Add play again
 * - [x] Type this shit
 */
function App() {
  const [won, setWon] = useState(false);
  const [gameState, setGameState] = useState(wordDetails(questions.question));
  const [guess, setGuess] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const initialWord = useMemo(() => anagramize(gameState), [gameState]);
  const [word, setWord] = useState("");

  useEffect(() => {
    setWord(initialWord);
  }, [initialWord]);

  const solveGame = (guess: string) => {
    if (guess.toLowerCase() === questions.answer.toLowerCase()) {
      return true;
    }
  };

  const solveAnagram = (guess: string) => {
    if (questions.question.split(" ").includes(guess)) {
      setGameState((prev) => {
        const newDetails = { ...prev };
        newDetails.words[guess].solved = true;
        return newDetails;
      });
      setGuess("");
      setSelectedIds([]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);

    console.log({ thing: e.target.value.length });

    const allLetters =
      document.querySelectorAll<HTMLSpanElement>("[data-letter]");

    if (e.target.value.length > guess.length) {
      const letter = e.target.value[e.target.value.length - 1];
      const letterSpan = Array.from(allLetters)
        .filter((el) => el.dataset.solved !== "true")
        .find(
          (el) => el.textContent === letter && !selectedIds.includes(el.id)
        );
      if (letterSpan) {
        console.log({ words: gameState.words });
        setSelectedIds((prev) => [...prev, letterSpan.id]);
      }
    } else if (e.target.value.length < guess.length) {
      const letter = guess[guess.length - 1];
      const letterSpan = Array.from(allLetters)
        .reverse()
        .find(
          (el) => el.dataset.value === letter && selectedIds.includes(el.id)
        );
      if (letterSpan) {
        if (selectedIds.includes(letterSpan.id)) {
          setSelectedIds((prev) => prev.filter((id) => id !== letterSpan.id));
        }
      }
    }
    if (e.target.value.length === 0) {
      setSelectedIds([]);
    }

    if (solveGame(e.target.value)) {
      setWon(true);
    }
    solveAnagram(e.target.value);
  };

  const shuffle = () => {
    setWord(anagramize(gameState));
  };

  useEffect(() => {
    solveAnagram(guess);
  }, [guess]);

  const handleClick = (
    e: Parameters<MouseEventHandler<HTMLSpanElement>>[0],
    reason: "on" | "off",
    id: string
  ) => {
    const target = e.target as HTMLSpanElement;
    if (reason === "on") {
      setSelectedIds((prev) => [...prev, id]);
      setGuess((prev) => prev + target.dataset.value);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      setGuess((prev) => {
        const reversedGuess = prev.split("").reverse().join("");
        const updatedGuess = reversedGuess.replace(
          target.dataset.value as string,
          ""
        );
        const finalGuess = updatedGuess.split("").reverse().join("");
        return finalGuess;
      });
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexShrink: "0",
          gap: "0.25em",
          maxWidth: "80vw",
          flexWrap: "wrap",
          justifyContent: "center",
          fontSize: "12em",
          lineHeight: "1.1",
          fontWeight: "bold",
        }}
      >
        {won ? (
          <span style={{ color: "springgreen" }}> {questions.question}</span>
        ) : (
          word.split(" ").map((w, i) => {
            const solved = !!Object.values(gameState.words).find(
              (word) => word.index === i
            )?.solved;
            return (
              <span
                style={{
                  color: solved ? "springgreen" : "inherit",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <SplitWord
                  word={w}
                  onClick={handleClick}
                  selectedIds={selectedIds}
                  solved={solved}
                />
              </span>
            );
          })
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1em",
        }}
      >
        <input type="text" onChange={handleChange} value={guess} />
        <button onClick={() => shuffle()}>
          <ShuffleIcon />
        </button>
      </div>
      {won && <h2>You won!</h2>}
    </div>
  );
}

export default App;

const SplitWord = ({
  word,
  onClick,
  selectedIds,
  solved,
}: {
  word: string;
  onClick: (
    e: Parameters<MouseEventHandler<HTMLSpanElement>>[0],
    reason: "on" | "off",
    id: string
  ) => void;
  solved: boolean;
  selectedIds: string[];
}) => {
  return word.split("").map((letter, i) => (
    <Letter
      onClick={onClick}
      id={i + word}
      data-value={letter}
      selectedIds={selectedIds}
      solved={solved}
    >
      {letter}
    </Letter>
  ));
};
