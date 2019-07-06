/**
 * cut the text to the desired length without cutting the last word
 * @param {string} text text to cut
 * @param {number} length length desired
 */
export default (text, length) => {
    if (!text) return '';
    if (text.length <= length) return text;
    let newText = text;
    newText = newText.substring(0, length);
    const last = newText.lastIndexOf(' ');
    newText = text.substring(0, last);
    return `${newText}...`;
};