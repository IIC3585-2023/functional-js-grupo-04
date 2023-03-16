



const transformText = (text) => {
    return text;
}





//////////////////////////////////////////////////////
// HTML code
const buttonClick = () => {
    const text = document.getElementById("text").innerHTML;
    const result = document.getElementById("result");
    result.innerHTML = transformText(text);
}

//////////////////////////////////////////////////////