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
        this.#name = value;
    }

    get name() {
        return this.#name;
    }

    set city(value) {
        this.#city = value;
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
const MAX_CAPACITY = 9;

listen('click', addBtn, () => {
    if (!isGridFull()) return;
    clearDisplay();
    let input = data.value;
    addContact(input);
});

function addContact(input) {
    const inputs = input.split(',').map(item => item.trim());

    if (!isValidateInput(input)) return;

    let [ name, city, email ] = data.value.split(',').map(item => item.trim());

    if (!isValidName(name) || !isValidEmail(email) || !city.length > 2) return;

    const contactObj = new Contact(name, city, email);
    contacts.unshift(contactObj);
    loadContacts();
    updateCounter();
}

function loadContacts() {
    if (contacts.length > 0) {
        clearGrid();
        contacts.forEach((item, index) => {
            const contactElement = create('div');
            contactElement.classList.add('contact');
            contactElement.setAttribute('data', index);

            const namePlaceholder = create('p');
            namePlaceholder.textContent =  `Name: ${item.name}`;
            contactElement.appendChild(namePlaceholder);

            const cityPlaceholder = create('p');
            cityPlaceholder.textContent =  `City: ${item.city}`;
            contactElement.appendChild(cityPlaceholder);

            const emailPlaceholder = create('p');
            emailPlaceholder.textContent =  `Email: ${item.email}`;
            contactElement.appendChild(emailPlaceholder);

            listen('click', contactElement, function(){
                let position = this.getAttribute('data');
                contacts.splice(position, 1);
                loadContacts();
                updateCounter();
            });
            grid.appendChild(contactElement);
        });
    }
}

function isValidateInput(input) {
    if (input.split(',').length !== 3) {
        displayMessage('Input format: name, city, email', ERROR);
        data.focus = true;
        return false;
    }
    return true;
}

function isValidName(name) {
    if (!name.includes(' ')) {
        displayMessage(
            'Name must include fist and last name separated by a space',
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

function displayMessage(message, type = 'error') {
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
}

function clearGrid() {
    grid.replaceChildren();
}