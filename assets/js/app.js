'use strict';

class Contact {
    #name = '';
    #city = '';
    #email = '';

    constructor(name, city, email) {
        this.name = name;
        this.city = city;
        this.email = email;
    }

    set name(value) {
        this.#name = capitalizeWord(value);
    }

    get name() {
        return this.#name;
    }

    set city(value) {
        this.#city = capitalizeWord(value);
    }

    get city() {
        return this.#city;
    }

    set email(value) {
        this.#email = value;
    }

    get email() {
        return this.#email;
    }

}

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function selectAll(selector, scope = document) {
    return scope.querySelectorAll(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function create(element, scope = document) {
    return scope.createElement(element);
}

const contacts = [];
const data = select('.contact-input');
const grid = select('.contact-list');
const counter = select('.counter');
const infoCenter = select('.info-center');
const addBtn = select('input[type="button"]');
const ERROR = 'error';
const MAX_CAPACITY = 100;

listen('click', addBtn, () => {
    let input = data.value;

    if (!isGridFull()) return;
    clearDisplay();
    addContact(input);
});

updateCounter();

function addContact(input) {
    if (!isValidateInput(input)) return;

    const inputs = input.split(',').map(item => item.trim());

    let [ name, city, email ] = inputs;

    if (!isValidName(name) || !isValidEmail(email) || !isValidCity(city)) return;

    const contactObj = new Contact(name, city, email);
    contacts.unshift(contactObj);
    listContacts();
    updateCounter();
}

function listContacts() {
    if (contacts.length >= 0) {
        clearGrid();
        contacts.forEach((item, index) => {
            const contactElement = create('div');
            contactElement.classList.add('contact');
            contactElement.setAttribute('data', index);

            contactElement.innerHTML = addDivContent(item);
            grid.appendChild(contactElement);
            
            listen('click', contactElement, function(){
                let position = this.getAttribute('data');
                clearDisplay();
                contacts.splice(position, 1);
                listContacts();
                updateCounter();
            });
        });
    }
}

function addDivContent(contact) {
    let html = '';
    html = `<p><span class="title">Name:</span> ${contact.name}</p>`;
    html += `<p><span class="title">City:</span> ${contact.city}</p>`
    html += `<p><span class="title">Email:</span> ${contact.email}</p>`

    return html;
}

function isValidateInput(input) {
    if (input.split(',').length !== 3) {
        displayMessage('Please enter contact info (name, city, email)', ERROR);
        data.focus = true;
        return false;
    }
    return true;
}

function isValidCity(city) {
    if (city.length < 2) {
        displayMessage('City must be more than 2 letters', ERROR);
        return false;
    }
    return true;
}

function isValidName(name) {
    if (!name.includes(' ')) {
        displayMessage(
            'Name must include first and last name separated by a space',
            ERROR
        );
        return false;
    }
    return true;
}

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        displayMessage('Email is not valid, please input valid email', ERROR);
        return false;
    }
    return true;
}

function isGridFull() {
    if (contacts.length >= MAX_CAPACITY) {
        displayMessage('Contact list is full', ERROR);
        return false;
    }
    return true;
}

function displayMessage(message, type = '') {
    if (type === 'error') {
        if (!infoCenter.classList.contains('error'))
            infoCenter.classList.add('error');
        infoCenter.innerText = message;
    } else {
        if (infoCenter.classList.contains('error')){
            infoCenter.classList.remove('error');
        }
        infoCenter.innerText = message;
    }
}

function clearDisplay() {
    infoCenter.innerText = '';
}

function updateCounter() {
    counter.innerText = contacts.length;
    if (contacts.length === 0) displayMessage('Contact list is empty');
}

function clearGrid() {
    grid.replaceChildren();
}

function capitalizeWord(word) {
    if (word.includes(' ')) {
        const wordArray = word.split(' ');
        return wordArray.map(str => 
            str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).join(' ');
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}