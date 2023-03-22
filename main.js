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

//Si solo quiero n primeras frases por parrafo, split cada parrafo
//luego mapear cada parrafo y split por .?
//luego dejar solo los primeros n u.u


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
  .join("\n")
  ;


// Combinator inspired by: const S = f => g => x => f(x)(g(x))
const sCombinator =
  (...functions) =>
  (text, n) =>
    functions.reduce((acc, f) => f(acc, n), text);

//////////////////////////////////////////////////////
// HTML code

const optionClick = (clicked_button) => {
  console.log(clicked_button.classList);
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
  //OJO cambie el n a 2 para probar
  result.innerHTML = transformText(text, (n = 15));
};

//////////////////////////////////////////////////////

// // Clean text helpers

// trim spaces of every "/n" and replace "\n...\n" with a single "/n"
const cleanText1 = (text) =>
  text.replace(/ +\n/g, "\n").replace(/\n+/g, "\n").replace(/\n +/g, "\n");

// if theres a dot followed by a lot of spaces, replace it with a dot followed by one space
const cleanText2 = (text) => text.replace(/\. +/g, ". ");
