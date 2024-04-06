# Spelling Bee

A replica of the NYT Spelling Bee

Tools used: 

* Frontend: Svelte, LightningCSS
* Backend: Node.js, Express.js, Bcrypt
* Database: MongoDB
* Word processing: Python

*By Pierce Martin*

---

Solutions:

- Use package [svelte-preprocess](https://www.npmjs.com/package/svelte-preprocess) for `<style global>` syntax, allowing global styles
- Use browser from "$app/environment" to check if code is running on client side
- Icon solution: [unplugin-icons](https://www.npmjs.com/package/unplugin-icons). Add 
  ```ts
  Icons({
    compiler: 'svelte',
    autoInstall: true
  })
  ```
  to `plugins` in `vite.config.ts` and
  ```ts
    /// <reference types="unplugin-icons/types/svelte" />
  ```
  to app.d.ts.
- Fetch user in user store file using the session cookie, then subscribe to changes in the user in the login/signup store to redirect if the user exists

## Ideas

* Hint button gives an additional letter every time you click it until it gives you the full word
  * Has a warning if it's about to give you the last letter
  * Points you earn = number of words you come up with

## TODO

* Add hint update endpoint and call when changing hint
* Add wordPreviewsOn update endpoint and call when changing value
* Add finish puzzle endpoint and call when the user finishes a puzzle
* Add animation for finishing a puzzle
* Improve params setting for requesting and params retrieving for API
* (?) Add metadata about each word so you know if you used a hint or word previews to get it