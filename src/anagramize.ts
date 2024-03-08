import { wordDetails } from "./wordDetails";

export const anagramize = (gameState: ReturnType<typeof wordDetails>) => {
  const wordsLeft = Object.entries(gameState.words).reduce(
    (acc, [key, value]) => {
      if (!value.solved) {
        return { [key]: value, ...acc };
      }
      return acc;
    },
    {}
  );

  let allLetters = Object.keys(wordsLeft)
    .reduce((acc, key) => {
      return key + acc;
    }, "")
    .replaceAll(" ", "")
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  const result: string[] = [];
  Object.entries(gameState.words).forEach(([word, metaData]) => {
    if (metaData.solved) {
      result[metaData.index] = word;
    } else {
      for (const _letter of word) {
        result[metaData.index]
          ? (result[metaData.index] += allLetters[0])
          : (result[metaData.index] = allLetters[0]);
        allLetters = allLetters.slice(1);
      }
    }
  });

  let hasDuplicate = false;
  result.forEach((word) => {
    if (
      Object.keys(gameState.words).includes(word) &&
      !gameState.words[word].solved
    ) {
      hasDuplicate = true;
    }
  });

  return hasDuplicate ? anagramize(gameState) : result.join(" ");
};
