// Cada frase debe comenzar con ​n​ espacios en blanco (después de un punto seguido)
const addSpacesFollowedDot = (text, n) =>
  cleanText2(text)
    .split(". ")
    .map((sentence, index) =>
      index > 0
        ? (sentence = "." + " ".repeat(n) + sentence)
        : (sentence = sentence)
    )
    .join("");

// Cada párrafo debe estar separado por ​n​ líneas (después de un punto aparte)
const addLinesSeparateDot = (text, n) =>
  text
    .split(".\n")
    .map((sentence, index) =>
      index > 0
        ? (sentence = "." + "\n".repeat(n + 1) + sentence)
        : (sentence = sentence)
    )
    .join("");

// Cada párrafo debe tener ​n​ espacios de sangría
const addIndentation = (text, n) =>
  text
    .split(".\n")
    .map((paragraph, index) =>
      index != 0 ? ".\n" + " ".repeat(n) + paragraph : " ".repeat(n) + paragraph
    )
    .join("");

// Combinator inspired by: const S = f => g => x => f(x)(g(x))
const sCombinator =
  (...functions) =>
  (text, n) =>
    functions.reduce((acc, f) => f(acc, n), text);

// Main function
const transformText = sCombinator(addIndentation, addLinesSeparateDot);

//////////////////////////////////////////////////////
// HTML code
const buttonClick = () => {
  const text = document.getElementById("text").value;
  const result = document.getElementById("result");
  result.innerHTML = transformText(text, (n = 15));
};

//////////////////////////////////////////////////////

// // Clean text helpers

// trim spaces of every "/n" and replace "\n...\n" with a single "/n"
const cleanText1 = (text) =>
  text.replace(/ +\n/g, "\n").replace(/\n+/g, "\n").replace(/\n +/g, "\n");

// if theres a dot followed by a lot of spaces, replace it with a dot followed by one space
const cleanText2 = (text) => text.replace(/\. +/g, ". ");

console.log(
  transformText(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nDonec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit",
    15
  )
);
