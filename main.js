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
  cleanText1(text)
    .split(".\n")
    .map((sentence, index) =>
      index > 0
        ? (sentence = "." + "\n".repeat(n + 1) + sentence)
        : (sentence = sentence)
    )
    .join("");

// El ancho del texto debe ser a lo más ​n​ (sin cortar palabras)
const addMaxWidth = (text, n) =>
  text
    .split(/(\s+)+/)
    .map((string) =>
      /^ *$/.test(string)
        ? string.split("").map((element) => (element === " " ? element : ""))
        : string
    )
    .map((string) =>
      /[\s+][\n+]/.test(string)
        ? string.split("").map((element) => (element === " " ? element : "\n"))
        : string
    )
    .filter((x) => x != "")
    .flat()
    .reduce(
      (accumulator, new_word) =>
        new_word.includes("\n")
          ? {
              current_line_characters: 0,
              current_text: accumulator.current_text + new_word,
            }
          : accumulator.current_line_characters + new_word.length > n
          ? {
              current_line_characters: new_word.length,
              current_text: accumulator.current_text + "\n" + new_word,
            }
          : {
              current_line_characters:
                accumulator.current_line_characters + new_word.length,
              current_text: accumulator.current_text + new_word,
            },

      { current_line_characters: 0, current_text: "" }
    )
    .current_text.replace(/(\n) (\w)/g, "$1$2"); // borra espacios los a la izquierda. Puede traer problemas pero se ve mejor. Quizas borrar.

// Combinator inspired by: const S = f => g => x => f(x)(g(x))
const sCombinator =
  (...functions) =>
  (text, n) =>
    functions.reduce((acc, f) => f(acc, n), text);

// Main function
const transformText = sCombinator(
  addSpacesFollowedDot,
  addLinesSeparateDot,
  addMaxWidth
);

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
