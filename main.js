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

// Solo las primeras n frases de cada párrafo 
const FirstPhrasesEachParagraph = (text, n) =>
  text
  .split(".\n")
  .map(paragraph => paragraph.split(".", n).join("."))
  .map((paragraph, index, paragraphs_array) =>
    index < (paragraphs_array.length - 1)
    ? (paragraph + ".")
    : n > 1
      ? paragraph 
      : (paragraph + "."))
  .join("\n");

// El ancho del texto debe ser a lo más ​n​ (sin cortar palabras)
const addMaxWidth = (text, n) => {
  const paragraphs = text.split(".\n");
  return paragraphs
    .map((paragraph) =>
      splitStringWithSingleSpaces(paragraph).reduce(
        (accumulator, new_word) =>
          accumulator.current_line_characters + new_word.length > n
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
    )
    .map((paragraphObject) => paragraphObject.current_text)
    .join(".\n");
};

// Cada párrafo debe tener ​n​ espacios de sangría
const addIndentation = (text, n) =>
  text
    .split(".\n")
    .map((paragraph, index) =>
      index > 0
        ? paragraph.replace(/^\n*/, "$&" + " ".repeat(n))
        : " ".repeat(n) + paragraph
    )
    .join(".\n");

//Se ignoran los párrafos que tienen menos de ​n​ frases
const ignoreShortParagraphs = (text, n) =>
  text
    .split(/(?<=\.\n)/)
    .map((paragraph) => paragraph.split(/(?=[\.])/))
    .filter((sentences) => sentences.length - 1 >= n)
    .map((paragraph) => paragraph.join(""))
    .join("");

// Se ignoran los párrafos que tienen menos de n frases
const ignoreParagraphsLessN = (text, n) =>
  text
  .split(".\n")
  .map(paragraph => 
    paragraph.split(".")
    .filter(paragraph => paragraph != ""))
  .filter(paragraph => paragraph.length <= n)
  .map(sentences => sentences.join("."))
  .join("\n");

// Cada frase debe aparecer en párrafo aparte
const addNewParagraphEachLine = (text) =>
  cleanText3(text)
  .split(".")
  .map(paragraph => paragraph.replace("\n", ""))
  .join(".\n");

// Combinator inspired by: const S = f => g => x => f(x)(g(x))
const sCombinator =
  (...functions) =>
  (text, n) =>
    functions.reduce((acc, f) => f(acc, n), text);

//////////////////////////////////////////////////////
// HTML code

const optionClick = (clicked_button) => {
  if (clicked_button.classList.contains("option-button-active")) {
    clicked_button.classList.remove("option-button-active");
  } else {
    clicked_button.classList.add("option-button-active");
  }
};

const getFunctionsSelected = () => {
  const option_buttons_functions = {
    "add-spaces-followed-dot": addSpacesFollowedDot,
    "add-lines-separate-dot": addLinesSeparateDot,
    "only-first-phrases-each-paragraph": FirstPhrasesEachParagraph,
    "add-identation": addIndentation,
    "ignore-short-paragraphs": ignoreShortParagraphs,
    "add-max-width": addMaxWidth,
    "ignore-long-paragraphs": ignoreParagraphsLessN,
    "each-line-paragraph": addNewParagraphEachLine,
  };
  const filtered_functions = Object.keys(option_buttons_functions).filter(
    (option_button_id) =>
      document
        .getElementById(option_button_id)
        .classList.contains("option-button-active")
  );
  return filtered_functions.map(
    (option_button_id) => option_buttons_functions[option_button_id]
  );
};

const buttonClick = () => {
  const text = document.getElementById("text").value;
  const result = document.getElementById("result");
  const functions_selected = getFunctionsSelected();
  const transformText = sCombinator(...functions_selected);
  result.innerHTML = transformText(text, (n = 3));
};

//////////////////////////////////////////////////////

// // helpers

// trim spaces of every "/n" and replace "\n...\n" with a single "/n"
const cleanText1 = (text) =>
  text.replace(/ +\n/g, "\n").replace(/\n+/g, "\n").replace(/\n +/g, "\n");

// if theres a dot followed by a lot of spaces, replace it with a dot followed by one space
const cleanText2 = (text) => text.replace(/\. +/g, ". ");

const splitStringWithSingleSpaces = (string) =>
  string
    .split(/(\s+)/)
    .map((word) => (word.match(/\s+/) ? word.split("") : word))
    .flat();

//If there is some spaces after the dot, it removes them.
const cleanText3 = (text) => text.replace(/\. +/g, ".");
