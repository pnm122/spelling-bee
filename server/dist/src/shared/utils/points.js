"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordMatchesHint = exports.getUniqueLetters = exports.isPangram = exports.getTotalPoints = exports.getPointsFromWord = exports.WORD_PREVIEWS_FACTOR = exports.PANGRAM_POINTS = void 0;
exports.PANGRAM_POINTS = 5;
// Multiplier when word previews are on
exports.WORD_PREVIEWS_FACTOR = 0.8;
/**
* Get the point value of a word. Equals the length of the word + PANGRAM_POINTS if the word is a pangram
* @param {string} word - Word to get value of
* @return {number} Word's point value
*/
function getPointsFromWord(word, hint, wordPreviewsOn) {
    let points = 0;
    // If the hint letters shown to the user match the start of the word, only give the user points for the difference
    // i.e. displayed hint = 'upp' and word = 'upper', the user gets 2 points
    if (wordMatchesHint(word, hint)) {
        points = word.length - hint.lettersGiven;
        // By default, the number of points you get is equal to the length of the word
    }
    else {
        points = word.length;
    }
    if (isPangram(word))
        points += exports.PANGRAM_POINTS;
    if (wordPreviewsOn)
        (points *= exports.WORD_PREVIEWS_FACTOR);
    return Math.round(points);
}
exports.getPointsFromWord = getPointsFromWord;
/**
* Get the point value of all words in a list
* @param {string[]} wordList
* @return {number} Total point value
*/
function getTotalPoints(wordList) {
    let total = 0;
    wordList.forEach(w => total += getPointsFromWord(w, undefined, false));
    return total;
}
exports.getTotalPoints = getTotalPoints;
/**
* Determine whether a word is a pangram
* @summary In this context, pangram means a word that has 7 unique letters, since each puzzle's "vocabulary" is 7 letters
* @param {string} word
* @return {boolean}
*/
function isPangram(word) {
    const letters = getUniqueLetters(word);
    if (letters.length == 7)
        return true;
    return false;
}
exports.isPangram = isPangram;
function getUniqueLetters(word) {
    let lettersSeen = [];
    for (let letter of word) {
        if (!lettersSeen.includes(letter))
            lettersSeen.push(letter);
    }
    return lettersSeen;
}
exports.getUniqueLetters = getUniqueLetters;
/**
* Determine whether a word matches a given hint
* @param {string} word
* @param {Hint} hint
* @return {boolean}
*/
function wordMatchesHint(word, hint) {
    return hint != undefined && (word.slice(0, hint.lettersGiven) == hint.word.slice(0, hint.lettersGiven));
}
exports.wordMatchesHint = wordMatchesHint;
//# sourceMappingURL=points.js.map