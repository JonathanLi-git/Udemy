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
    #mapEvent; 
    #workouts


    constructor() {
        this._getPosition()
        this._showForm()
        this._toggleElevationField()
        this.#workouts = new Array();
    }

    _getPosition() {
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
            alert('could not get location')
        }) 
    }
     
    _loadMap(position) {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        console.log(`https://www.google.ca/maps/@${latitude},${longitude}`)
        
        this.#map = L.map('map').setView([latitude, longitude], 15);
            
         
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        
        this.#map.on('click', function (mapE) {
            this.#mapEvent = mapE
            form.classList.remove('hidden')
            inputDistance.focus()
        }.bind(this))
    }

    _showForm() {
        form.addEventListener('submit', function(e) {
            e.preventDefault()
            this._newWorkout(e)
        
            inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = ''
            L.marker([this.#mapEvent.latlng.lat, this.#mapEvent.latlng.lng]).bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup',
            }))
            .addTo(this.#map).setPopupContent('workout')
            .openPopup();
        }.bind(this))
    }
     
    _toggleElevationField() {
        inputType.addEventListener('change', function() {
            const exerciseType = inputType.value
            if(exerciseType == 'running') {
                inputCadence.closest('.form__row').classList.remove('form__row--hidden')
                inputElevation.closest('.form__row').classList.add('form__row--hidden')
        
            }
            else {
                inputCadence.closest('.form__row').classList.add('form__row--hidden')
                inputElevation.closest('.form__row').classList.remove('form__row--hidden')
            }
        })
    }

    _newWorkout(e) {
        console.log(e)
        e.preventDefault()
        //get data from form
        const type = inputType.value
        const distance = +inputDistance.value
        const duration = +inputDuration.value
        let cadenceElevation = undefined
        const {lat,lng} = this.#mapEvent.latlng

        //check if data is valid
        if(distance < 1 || duration < 1 || distance === NaN || duration === NaN) {
            alert("Invalid input, please check the input")
        }
        //create object as running/cycling and add to workout array
        if(type === "running") {
            cadenceElevation = +inputCadence.value
            const RunningWorkout = new Running([lat,lng], distance, duration, cadenceElevation)
            this.#workouts.push(RunningWorkout)
        }
        else {
            cadenceElevation = +inputElevation.value
            const CyclingWorkout = new Cycling([lat,lng], distance, duration, cadenceElevation)
            this.#workouts.push(CyclingWorkout)
        }
        


        //render workout on map
        
        //render on list

        //hide form/clear input fields
    }
}

class Workout {
    date = new Date() 
    id = (Date.now() + ''.slice(-10))
    constructor(coords,distance,duration) {

        this.coords = coords
        this.distance = distance
        this.duration = duration
    }

    id(){

    }

    distance() {

    }

    duration () {

    }

    coords () {

    }

    date() {

    }   
}

class Running extends Workout {
    constructor(coords,distance,duration,cadence) {
        super(coords,distance,duration)
        this.cadence = cadence
        const pace = this.calcPace()
    }

    name() {

    }
    cadence () {

    }

    calcPace() {
        //miles per minute
        this.pace = this.duration/this.distance
        return this.pace
    }
}

class Cycling extends Workout {
    constructor(coords,distance,duration,elevationGain) {
        super(coords,distance,duration)
        this.elevationGain = elevationGain
        this.calcSpeed()
    }

    name() {

    }

    elevationGain() {

    }

    calcSpeed() {
        this.speed = this.distance/(this.duration/60)
        return this.speed
    }
}
const app = new App()
