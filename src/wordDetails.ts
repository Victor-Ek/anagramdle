export function wordDetails(text: string) {
  const split = text.split(" ");

  // Initialize an object to store word lengths
  const words: {
    [key: string]: { length: number; solved: boolean; index: number };
  } = {};

  // Iterate over each word
  split.forEach((word, index) => {
    // Calculate the length of the word
    const length = word.length;

    // Store the length in the wordLengths object
    words[word] = { length, solved: false, index };
  });

  // Return the object containing word lengths
  return {
    wordCount: split.length,
    words: words,
  };
}
