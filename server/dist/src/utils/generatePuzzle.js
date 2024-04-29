"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const points_1 = require("../shared/utils/points");
const getMatchingWords_1 = __importDefault(require("./getMatchingWords"));
const getTodaysDate_1 = __importDefault(require("../shared/utils/getTodaysDate"));
const fs_1 = require("fs");
const shuffle_1 = __importDefault(require("./shuffle"));
async function generatePuzzle() {
    const MIN_POINTS = 200;
    const MAX_POINTS = 500;
    const promise = new Promise((resolve, reject) => {
        (0, fs_1.readFile)('data/pangrams.txt', 'utf8', (pangramsErr, pangramsData) => {
            if (pangramsErr) {
                return reject(pangramsErr);
            }
            (0, fs_1.readFile)('data/wordlist.txt', 'utf8', (wordListErr, wordListData) => {
                if (wordListErr) {
                    return reject(wordListErr);
                }
                // Split files into lines
                const pangrams = pangramsData.match(/[^\r\n]+/g);
                const validWordList = wordListData.match(/[^\r\n]+/g);
                let centerLetter = '';
                let outsideLetters = ['', '', '', '', '', ''];
                let wordList = [];
                let maxPoints = -1;
                // Generate a "good" random puzzle
                // I define "good" as a puzzle with at least one pangram and between MIN_POINTS and MAX_POINTS points
                // Until a puzzle is generated with these conditions:
                // Try a random pangram, using one letter at random as the center letter
                // If this puzzle doesn't generate between MIN_POINTS and MAX_POINTS points, try another random combo
                // With poorly chosen MIN_PONTS and MAX_POINTS, this could go on for a long time, but the numbers I've chosen
                // are relatively common, so it usually doesn't take more than a couple iterations to find a match
                while (maxPoints < MIN_POINTS || maxPoints > MAX_POINTS) {
                    // Pull a random pangram
                    const randomPangramIndex = Math.round(Math.random() * (pangrams.length - 1));
                    const randomPangram = pangrams[randomPangramIndex];
                    // Choose a random center letter, leaving the rest as outside letters
                    const letters = (0, points_1.getUniqueLetters)(randomPangram);
                    const centerLetterIndex = Math.round(Math.random() * (letters.length - 1));
                    centerLetter = letters[centerLetterIndex];
                    outsideLetters = letters.filter(l => l != centerLetter);
                    // Generate the word list based on these conditions
                    wordList = (0, getMatchingWords_1.default)(validWordList, centerLetter, outsideLetters);
                    maxPoints = (0, points_1.getTotalPoints)(wordList);
                    let numPangrams = 0;
                    for (let word of wordList) {
                        if ((0, points_1.isPangram)(word))
                            numPangrams++;
                    }
                }
                const puzzle = {
                    centerLetter,
                    outsideLetters: (0, shuffle_1.default)(outsideLetters),
                    wordList,
                    maxPoints,
                    date: (0, getTodaysDate_1.default)()
                };
                resolve(puzzle);
            });
        });
    });
    return promise;
}
exports.default = generatePuzzle;
//# sourceMappingURL=generatePuzzle.js.map