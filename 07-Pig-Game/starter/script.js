'use strict';

const p1Total = document.querySelector('#score--0')
const p1Current = document.querySelector('#current--0')
const p2Total = document.querySelector('#score--1')
const p2Current = document.querySelector('#current--1')
const dice = document.querySelector('.dice')
const roll = document.querySelector('.btn--roll')
const restart = document.querySelector('.btn--new')
const hold = document.querySelector('.btn--hold')

let p1CurrentScore = 0;
let p2CurrentScore = 0;
let p1TotalScore = 0;
let p2TotalScore = 0;
let isP1Turn = true;

roll.addEventListener('click', function () {
    let num = Math.trunc(Math.random()*6+1)
    dice.src = `dice-${num}.png`

    if(num !== 1 && isP1Turn) {
        p1CurrentScore += num
        p1Current.textContent = p1CurrentScore
    }
    else if(num === 1 && isP1Turn) {
        p1Current.textContent = '0'
        p1CurrentScore = 0;
        isP1Turn = false;
    }
    else if(num !== 1 && !isP1Turn) {
        p2CurrentScore += num
        p2Current.textContent = p2CurrentScore
    }
    else if(num === 1 && !isP1Turn) {
        p2Current.textContent = '0'
        p2CurrentScore = 0
        isP1Turn = true;
    }

})

hold.addEventListener('click', function () {
    if(isP1Turn && p1CurrentScore > 0) {
        p1TotalScore += p1CurrentScore
        p1Total.textContent = p1TotalScore
        //Winning scenario for player 1
        if(p1TotalScore >= 100) {
            p1Current.textContent = 'Player 1 wins!'
            roll.disabled = true;
            hold.disabled = true;
            document.querySelector('body').style.backgroundImage = 'linear-gradient(to top left, #4fda89 0%, #1ea104 100%)'
        }
        else {
            p1CurrentScore = 0
            p1Current.textContent = 0
            isP1Turn = false
        }
    }

    else if(!isP1Turn && p2CurrentScore > 0) {
        p2TotalScore += p2CurrentScore
        p2Total.textContent = p2TotalScore

        //winning scneario for player 2
        if(p2TotalScore >= 100) {
            p2Current.textContent = 'Player 2 wins!'
            roll.disabled = true;
            hold.disabled = true;
            document.querySelector('body').style.backgroundImage = 'linear-gradient(to top left, #4fda89 0%, #1ea104 100%)'
        }
        else {
            p2CurrentScore = 0
            p2Current.textContent = 0
            isP1Turn = true
        }
    }

    restart.addEventListener('click', function () {
        //activate buttons
        roll.disabled = false
        hold.disabled = false

        p1Current.textContent = 0;
        p2Current.textContent = 0;
        p1Total.textContent = 0;
        p2Total.textContent = 0;

        p1CurrentScore = 0;
        p2CurrentScore = 0;
        p1TotalScore = 0;
        p2TotalScore = 0;

        document.querySelector('body').style.backgroundImage = 'linear-gradient(to top left, #753682 0%, #bf2e34 100%)'
        isP1Turn = true;
    })
})