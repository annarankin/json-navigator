# JSON Navigator

This program is intended as a tool to help students learn to navigate nested data structures.

#### [Try it out!](http://annarankin.github.io/json-navigator/)

### Features

1. User can input valid JSON and see a prettily formatted version in their browser.
1. User can hover over keys and values and see them highlighted in different colors.
1. User can hover over a value and its "address," or a combination of index numbers (e.g. `[0]`) and keys (e.g. `.weather`), will be displayed and copied to their clipboard.

### To Do

#### Additional Features

- Allow navigator output to be formatted for Ruby or JavaScript.
- A tooltip is displayed when a user hovers over a bracket with the line number of the other bracket it's paired with.

#### Refactor

- Add error handling for incorrect input/invalid JSON.
- ~~Refactor so that individual lines of code are nested inside of divs for easier navigation.~~ Done
- **Bug fix**: Commas display after the last element in nested objects/arrays.
