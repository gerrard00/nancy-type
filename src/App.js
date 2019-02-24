import React, { Component } from 'react';
import './App.css';


const firstRightHandKeys = [
  'j',
  'k',
  'l',
];

const firstLeftHandKeys = [
  's',
  'd',
  'f',
];

const rightHandPinky = [ ';' ];
const leftHandPinky = [ 'a' ];

const levels = {
  1: {
    description: "First steps with the right hand",
    keys: [
      ...firstRightHandKeys,
    ]
  },
  2: {
    description: "First steps with the left hand",
    keys: [
      ...firstLeftHandKeys,
    ]
  },
  3: {
    description: "Our first time with two hands",
    keys: [
      ...firstRightHandKeys,
      ...firstLeftHandKeys,
    ]
  },
  4: {
    description: "Let's get some pinky action going",
    keys: [
      ...firstRightHandKeys,
      // hacky way to increase the odds
      ...rightHandPinky,
      ...rightHandPinky,
      ...rightHandPinky,
    ]
  },
  5: {
    description: "And now the other pinky",
    keys: [
      ...firstLeftHandKeys,
      // hacky way to increase the odds
      ...leftHandPinky,
      ...leftHandPinky,
      ...leftHandPinky,
    ]
  },
  6: {
    description: "Full pinky mastery!",
    keys: [
      ...firstRightHandKeys,
      ...firstLeftHandKeys,
      ...rightHandPinky,
      ...leftHandPinky,
    ]
  },
};

const maxLevel = Object.keys(levels).length;

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * Math.floor(max - min));
}

function getKeyForLevelNumber(levelNumber) {
  const levelObject = levels[levelNumber];
  const randomIndex = getRandomInt(0, levelObject.keys.length);
  return levelObject.keys[randomIndex];
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      keysEnteredBefore: [],
      keyEntered: '',
      score: 0,
      streak: 0,
      level: 1,
      nextKey: getKeyForLevelNumber(1),
    };
    this.keyupHandler = this.keyupHandler.bind(this);
  }

  keyupHandler(e) {
    const keyEntered = e.key;

    if (keyEntered === this.state.nextKey) {
      const currentStreak = this.state.streak + 1;

      let levelToUse;
      let streakToUse;

      if (currentStreak >= 20 && this.state.level < maxLevel) {
        console.log('level up');
        levelToUse = this.state.level + 1;
        streakToUse = 0;
      } else {
        levelToUse = this.state.level;
        streakToUse = currentStreak;
      }

      const newState = {
        ...this.state,
        score: this.state.score + 1,
        streak: streakToUse,
        level: levelToUse,
        nextKey: getKeyForLevelNumber(levelToUse),
        keysEnteredBefore: [
          ...this.state.keysEnteredBefore,
          keyEntered,
        ],
        keyEntered: '',
        wrongKey: '',
      };

      this.setState(newState);
    } else {
      const newIncorrectState = {
        ...this.state,
        wrongKey: keyEntered,
        streak: 0,
      };

      this.setState(newIncorrectState);
    }

  }

  componentDidMount() {
    document.addEventListener('keyup', this.keyupHandler);
  }
  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyupHandler);
  }
  render() {
    return (

      <div className="game">
        <div>
          <select
            value={this.state.level}
            onChange={
              (e) => {
                this.setState({
                  ...this.state,
                  level: e.target.value,
                  nextKey: getKeyForLevelNumber(e.target.value),
                });
              }
            }
          >
            {
              Object.entries(levels).map(([levelNumber, levelObject]) => (
                <option key={levelNumber} value={levelNumber}>
                  {levelObject.description}
                </option>
              )
              )
            }
          </select>
        </div>
        <div className="score-display">{this.state.score}</div>
        <div> {this.state.keysEnteredBefore.join('-') }
        </div>
        <div>Enter:</div>
        <div className="next-key-display">{this.state.nextKey}</div>
        <div className="wrong-key-display">{this.state.wrongKey}</div>
      </div>
    );
  }
}

export default App;
