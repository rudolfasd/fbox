This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

**Live Demo [http://fb-qt.doitwell.ru](http://fb-qt.doitwell.ru)**


## Install node modules
In the project directory, you can run:
### `npm install`

## Run
### `npm start`
or
### `BROWSER=none npm start`
for starting without browser autoloading.

The app will have been started in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## Run test
### `npm test -- --testPathIgnorePatterns browser.test.js`
Launches the test runner in the interactive watch mode skiping end-2-end tests on /src/\_\_tests\_\_/browser.test.js.

## End-2-end
**Note.** _To test e2e you need installed Chrome Web Browser on your OS.
The app must be running_

### `npm test browser.test.js`
Or you can just run all the tests
### `npm test`


##
**Note** _If you want to see what happens during the test, replace the lines on /src/\_\_tests\_\_/browser.test.js_

`const HEADLESS = true`

`const PAGE_WAIT_FOR = false`

`const SLOWMO = 0`

_with_

`const HEADLESS = false`

`const PAGE_WAIT_FOR = true`

`const SLOWMO = 5`

