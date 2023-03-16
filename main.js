

// Cada frase debe comenzar con ​n​ espacios en blanco (después de un punto seguido)
const addSpacesFollowedDot = (text, n) => text.split(". ").map(
    (sentence, index) => index > 0 ? sentence = "." + " ".repeat(n) + sentence : sentence = sentence
    ).join("");


// Cada párrafo debe estar separado por ​n​ líneas (después de un punto aparte)
const addLinesSeparateDot = (text, n) => text.split(".\n").map(
    (sentence, index) => index > 0 ? sentence = "." + "\n".repeat(n) + sentence : sentence = sentence
    ).join("");



// Combinator inspired by: const S = f => g => x => f(x)(g(x))
const sCombinator = (...functions) => (text, n) => functions.reduce((acc, f) => f(acc, n), text);



// Main function
const transformText = sCombinator(
    addSpacesFollowedDot,
    addLinesSeparateDot
);



//////////////////////////////////////////////////////
// HTML code
const buttonClick = () => {
    const text = document.getElementById("text").value;
    const result = document.getElementById("result");
    result.innerHTML = transformText(text, n=10);
}

//////////////////////////////////////////////////////