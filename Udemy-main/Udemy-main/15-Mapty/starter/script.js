'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map, mapEvent;

class App {
  #map;
  #typee;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();
    this._showForm();
    this._toggleElevationField();
    this.#workouts = new Array();
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert('could not get location');
      }
    );
  }

  _loadMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`https://www.google.ca/maps/@${latitude},${longitude}`);

    this.#map = L.map('map').setView([latitude, longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on(
      'click',
      function (mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
      }.bind(this)
    );
  }

  _showForm() {
    form.addEventListener(
      'submit',
      function (e) {
        this._newWorkout(e);
      }.bind(this)
    );
  }

  _toggleElevationField() {
    inputType.addEventListener('change', function () {
      const exerciseType = inputType.value;
      if (exerciseType == 'running') {
        inputCadence
          .closest('.form__row')
          .classList.remove('form__row--hidden');
        inputElevation.closest('.form__row').classList.add('form__row--hidden');
      } else {
        inputCadence.closest('.form__row').classList.add('form__row--hidden');
        inputElevation
          .closest('.form__row')
          .classList.remove('form__row--hidden');
      }
      console.log(inputType.value);
    });
  }

  _newWorkout(e) {
    e.preventDefault();
    //get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    let cadenceElevation = undefined;
    let workout = undefined;
    const { lat, lng } = this.#mapEvent.latlng;

    //check if data is valid
    if (distance < 1 || duration < 1 || distance === NaN || duration === NaN) {
      alert('Invalid input, please check the input');
    }
    //create object as running/cycling and add to workout array

    if (type === 'running') {
      cadenceElevation = +inputCadence.value;
      workout = new Running([lat, lng], distance, duration, cadenceElevation);
    } else {
      cadenceElevation = +inputElevation.value;
      workout = new Cycling([lat, lng], distance, duration, cadenceElevation);
    }
    this.#workouts.push(workout);

    //render workout on map

    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';
    L.marker([this.#mapEvent.latlng.lat, this.#mapEvent.latlng.lng])
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${type}-popup`,
        })
      )
      .addTo(this.#map)
      .setPopupContent(
        type === 'running'
          ? workout.description()
          : workout.descriptionCycling()
      )
      .openPopup();

    //render on list
    console.log(this.#workouts);

    //hide form/clear input fields
  }
}

class Workout {
  date = new Date();
  id = Date.now() + ''.slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  id() {
    return this.id;
  }

  distance() {
    return this.distance;
  }

  duration() {
    return this.duration;
  }

  coords() {
    return this.coords;
  }
  description() {}

  date() {
    return this.date;
  }

  renderWorkout(workout) {}
}

class Running extends Workout {
  #description = '';
  #type = 'Running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    const pace = this.calcPace();
    this._setDescription();
  }

  name() {}
  description() {
    return this.#description;
  }

  _setDescription() {
    this.#description = `${this.#type} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;

    const html = `
        <li class="workout workout--${this.#type}" data-id="${this.id}">
          <h2 class="workout__title">${this.#description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              this.#type === 'Running' ? '🏃‍♂️' : '🚴'
            }</span>
            <span class="workout__value">${this.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${this.duration}</span>
            <span class="workout__unit">min</span>  

          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${this.cadence}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${this.calcPace()}</span>
            <span class="workout__unit">spm</span>
          </div>
    `;

    form.insertAdjacentHTML('afterend', html);

    console.log(this.#description);
  }
  cadence() {}

  calcPace() {
    //miles per minute
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

//-------------------------------------------------------------------------

class Cycling extends Workout {
  #description = '';
  #type = 'Cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  name() {}
  descriptionCycling() {
    return this.#description;
  }

  _setDescription() {
    this.#description = `${this.#type} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;

    const html = `
    <li class="workout workout--${this.#type}" data-id="${this.id}">
      <h2 class="workout__title">${this.#description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          this.#type === 'running' ? '🏃‍♂️' : '🚴'
        }</span>
        <span class="workout__value">${this.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${this.duration}</span>
        <span class="workout__unit">min</span>  
      </div>

      <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${this.calcSpeed()}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${this.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
    `;

    form.insertAdjacentHTML('afterend', html);

    console.log(this.#description);
  }

  elevationGain() {}

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
const app = new App();
