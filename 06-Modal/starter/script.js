'use strict';

const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const closeModal = document.querySelector('.close-modal')
const showModal = document.querySelectorAll('.show-modal')

for(let i = 0; i < showModal.length; i++) {
        showModal[i].addEventListener('click', function () {
            modal.classList.remove('hidden')
            overlay.classList.remove('hidden')
        });
}

function removeHidden() {
    modal.classList.add('hidden')
    overlay.classList.add('hidden')
}

closeModal.addEventListener('click', function () {
    removeHidden();
})

overlay.addEventListener('click', function () {
    removeHidden();

})

document.addEventListener('keydown', function (e) {
    if(e.key == 'Escape' && !modal.classList.contains('hidden'))
      removeHidden(); 
})