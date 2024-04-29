"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Randomize order of an array
// https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
exports.default = shuffle;
//# sourceMappingURL=shuffle.js.map