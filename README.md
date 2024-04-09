# Spelling Bee

**v1.0.0**

A replica of the NYT Spelling Bee, with extra features including word previews and hints.

*Pierce Martin*

## Features

* User authentication with sessions that automatically expire after 1 hour without user action
* Spelling Bee game with both mouse and keyboard support
* Fully responsive design
* Tools to help solve the puzzle
  * Word previews - shows all words with the letters hidden, and the center letter marked as yellow, at the expense of losing 20% of all points earned after turning it on
  * Hints - gives the first 3 letters of a random word, at the expense of 3 points if you find a word that starts with the given letters
  * Shuffle button to move letters around
* Light and dark modes
* User stats tracked, including words & pangrams found, puzzles played and solved, and longest word
* Level system based on points earned
* Word list in most-recently-found order
* Progress tracker, showing the points you've earned on a puzzle vs. the maximum points
* Animation for finding pangrams

## Tools used

* Frontend: Svelte, SvelteKit, LightningCSS
* Backend: Node.js, Express.js, Bcrypt
* Database: MongoDB
* Word preprocessing: Python