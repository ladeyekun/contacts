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

function create(element, scope = Document) {
    return scope.createElement(element);
}

const contacts = [];
const data = select('.contact-input');
const grid = select('.contact-list');
const counter = select('.counter');
const infoCenter = select('.info-center');
const addBtn = select('input[type="button"]');
const ERROR = 'error';

listen('click', addBtn, () => {
    let input = data.value.trim();
    validateInput();
});

function validateInput() {
    let [ name, city, email ] = data.value.split(',');
    name = name.trim();
    city = city.trim();
    email = email.trim();

    if (!isNameValid(name)){
        displayMessage(
            'Name must include fist and last name separated by a space',
            ERROR
        );
        return;
    }

    if (!isEmailValid(email)){
        displayMessage('Email is not valid, please input valid email', ERROR);
        return;
    }
}

function isNameValid(name) {
    console.log(name.split(' ').length);
    return name.split(' ').length > 1;
}

function isEmailValid(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
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
