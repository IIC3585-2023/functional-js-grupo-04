// Cada frase debe comenzar con ​n​ espacios en blanco (después de un punto seguido)
const addSpacesFollowedDot = (text, n) =>
  _.chain(cleanText2(text))
    .split(". ")
    .map((sentence, index) =>
      index > 0
        ? (sentence = "." + " ".repeat(n) + sentence)
        : (sentence = sentence)
    )
    .join("")
    .value();

// Cada párrafo debe estar separado por ​n​ líneas (después de un punto aparte)
const addLinesSeparateDot = (text, n) =>
  _.chain(cleanText1(text))
    .split(".\n")
    .map((sentence, index) =>
      index > 0
        ? (sentence = "." + "\n".repeat(n + 1) + sentence)
        : (sentence = sentence)
    )
    .join("")
    .value();

// El ancho del texto debe ser a lo más ​n​ (sin cortar palabras)
const addMaxWidth = (text, n) => {
  const paragraphWidthReducer = (accumulator, new_word) => {
    if (new_word === "\n") {
      return {
        current_line_characters: 0,
        current_text: accumulator.current_text + new_word,
      };
    } else {
      return accumulator.current_line_characters + new_word.length > n
        ? {
            current_line_characters: new_word.length,
            current_text: accumulator.current_text + "\n" + new_word,
          }
        : {
            current_line_characters:
              accumulator.current_line_characters + new_word.length,
            current_text: accumulator.current_text + new_word,
          };
    }
  };

  const wrappText = _.flow([
    (text) => splitStringWithSingleSpaces(text),
    (paragraphs) =>
      _.reduce(paragraphs, paragraphWidthReducer, {
        current_line_characters: 0,
        current_text: "",
      }),
  ]);

  return wrappText(text).current_text;
};

// Cada párrafo debe tener ​n​ espacios de sangría
const addIndentation = (text, n) =>
  _.chain(text)
    .split(".\n")
    .map((paragraph, index) =>
      index > 0
        ? paragraph.replace(/^\n*/, "$&" + " ".repeat(n))
        : " ".repeat(n) + paragraph
    )
    .join(".\n")
    .value();

// Se ignoran los párrafos que tienen menos de ​n​ frases
const ignoreShortParagraphs = (text, n) =>
  text
    .split(/(?<=\.\n)/)
    .map((paragraph) => paragraph.split(/(?=[\.])/))
    .filter((sentences) => sentences.length - 1 >= n)
    .map((paragraph) => paragraph.join(""))
    .join("");

// Se ignoran los párrafos que tienen más de n frases
const ignoreParagraphsMoreN = (text, n) =>
  cleanText3(text)
    .split(".\n")
    .map((paragraph) =>
      paragraph.split(".").filter((paragraph) => paragraph != "")
    )
    .filter((paragraph) => paragraph.length <= n)
    .map((sentences) => sentences.join(". ")) // Join sentences in each paragraph
    .map((paragraph) => paragraph + ".")
    .join("\n");

// Cada frase debe aparecer en párrafo aparte
const addNewParagraphEachLine = (text) =>
  _.chain(text)
    .split("\n")
    .join(" ")
    .split(". ")
    .filter((paragraph) => paragraph != "")
    .map((paragraph) => paragraph.replace(".", ""))
    .map((paragraph) => paragraph + ".")
    .join("\n")
    .value();

// Solo las primeras n frases de cada párrafo
const FirstPhrasesEachParagraph = (text, n) =>
  _.chain(cleanText3(text))
    .split(".\n")
    .map((paragraph) =>
      paragraph
        .split(".", n)
        .filter((paragraph) => paragraph != "")
        .join(". ")
    )
    .map((paragraph) => paragraph + ".")
    .join("\n")
    .value();

// Combinator inspired by: const S = f => g => x => f(x)(g(x))
const sCombinator = (functions) => (text, n_array) =>
  functions.reduce(
    (acc, f, current_index) => f(acc, n_array[current_index]),
    text
  );

//////////////////////////////////////////////////////
// HTML code

const getFunctionsAndNSelected = () => {
  const option_buttons_functions = {
    "add-spaces-followed-dot": addSpacesFollowedDot,
    "ignore-short-paragraphs": ignoreShortParagraphs,
    "ignore-long-paragraphs": ignoreParagraphsMoreN,
    "each-line-paragraph": addNewParagraphEachLine,
    "only-first-phrases-each-paragraph": FirstPhrasesEachParagraph,
    "add-lines-separate-dot": addLinesSeparateDot,
    "add-identation": addIndentation,
    "add-max-width": addMaxWidth,
  };
  const filtered_functions = Object.keys(option_buttons_functions).filter(
    (option_button_id) =>
      document
        .getElementById(option_button_id)
        .classList.contains("option-button-active")
  );
  const functions_selected = filtered_functions
    .map((option_button_id) => option_buttons_functions[option_button_id])
    .flat();
  const n_for_functions = filtered_functions.map((option_button_id) =>
    parseInt(document.getElementById(option_button_id + "-n").value)
  );
  return {
    functions_selected: functions_selected,
    n_for_functions: n_for_functions,
  };
};

const buttonClick = () => {
  const text = document.getElementById("text").value;
  const result = document.getElementById("result");
  const { functions_selected, n_for_functions } = getFunctionsAndNSelected();
  const transformText = sCombinator(functions_selected);
  result.innerHTML = transformText(text, n_for_functions);
};

//////////////////////////////////////////////////////

// // Helpers

// Trim spaces of every "/n" and replace "\n...\n" with a single "/n"
const cleanText1 = (text) =>
  text.replace(/ +\n/g, "\n").replace(/\n +/g, "\n").replace(/\n+/g, "\n");

// If theres a dot followed by a lot of spaces, replace it with a dot followed by one space
const cleanText2 = (text) =>
  text.replace(/\.([^\n])/g, ". $1").replace(/\. +/g, ". ");

const splitStringWithSingleSpaces = (string) =>
  _.chain(string)

    .split(/(\s+)/)
    .map((word) => (word.match(/\s+/) ? word.split("") : word))
    .flatten()
    .value();

// If there is some spaces after the dot, it removes them.
const cleanText3 = (text) => text.replace(/\. +/g, ".");
