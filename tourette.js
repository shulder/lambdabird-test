/*
Create CustomEvent with name shout and detail with the random author (from authorsList) and
randomly generated text.
The script will dispatch the event on a random interval (1-5 seconds)
*/
const authorsList = [
  {
    _id: 1,
    name: 'Todd',
  },
  {
    _id: 3,
    name: 'Rob',
  },
  {
    _id: 3,
    name: 'Sevil',
  },
];

const generateRandomString = () => Math.random().toString(36).substring(7);

const generateRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const getRandomAuthor = () => authorsList[generateRandomInt(0, 2)].name;

// create a closure to keep the reference to the DOM element
const authorShout = element => () => {
  const author = getRandomAuthor();
  const text = generateRandomString();
  const event = new CustomEvent('shout', {
    detail: {
      author,
      text,
    },
  });
  element.dispatchEvent(event);
};

// keep a global reference to clear the interval when needed
let timer;

const startDispatching = (element) => {
  clearInterval(timer); // prevents from several setIntervals working at the same time
  const func = authorShout(element);
  const interval = generateRandomInt(1, 5) * 1000;
  timer = setInterval(func, interval);
};

const stopDispatching = () => {
  clearInterval(timer);
};

export {
  startDispatching,
  stopDispatching,
};
