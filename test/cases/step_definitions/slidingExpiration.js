/**
 * Created by nemaeska on 17.10.16.
 */

import XHR from 'xmlhttprequest';
import jwt from 'jsonwebtoken';
import config from 'config';

import Browser from '../../utils/Browser';

const XMLHttpRequest = XHR.XMLHttpRequest;

const myStepDefinitionsWrapper = function stepDefinition() {
    const browser = Browser.instance;

    this.When(/^I send POST request to login with checkbox: (.*) username: (.*) and password: (.*)$/, (checkbox, email, password) => {
        const xhr = new XMLHttpRequest();

        const user = JSON.stringify({ user: {
            username: email,
            password,
            isChecked: checkbox
        } });

        xhr.open('POST', `http://${config.express.host}:${config.express.port}/openapi/v1/login`, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(user);
        if (xhr.status !== 200) {
            throw new Error(`[Bad response] Code: ${xhr.status} Res: ${xhr.responseText}`);
        } else {
            browser.setToken(JSON.parse(xhr.responseText).token);
        }
    });

    this.Then(/^I get a new valid JWT token with an expiration date of (.*) minutes after the current date on the server$/, minutes => {
        // TODO Написать проверку для поля dateExpired
        const decodedToken = jwt.verify(browser.getToken(), config.jwtSecret);
        const currentServerDate = new Date();
        const delta = Math.floor((new Date(decodedToken.expDate) - currentServerDate) / (60 * 1000));
        if (minutes - 1 !== delta) {
            throw new Error('Тест упал');
        }
    });

    this.Given(/^I have a User with checkbox: (.*)$/, checkbox => {
        console.warn(`user push checkbox: ${checkbox}`); // а юзер точно есть?
    });

    this.Given(/^I have a token with an expiration date for (.*) minutes the most current date on the server or equal to it$/, delta => {
        // TODO Написать подмену существующего токена на аналогичный с необходимым значением dateExpired
        const decodedToken = jwt.verify(browser.getToken(), config.jwtSecret);
        const newExpDate = new Date().getMinutes() + delta;

        const newToken = jwt.sign({
            sub: decodedToken.sub,
            role: decodedToken.role,
            expDate: new Date().setMinutes(newExpDate)
        }, config.jwtSecret);

        browser.setToken(newToken);
    });

    this.When(/^I send GET request to the API$/, () => {
        // TODO написать обращение к API
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `http://${config.express.host}:${config.express.port}/api/v1/echo`);
        xhr.send();

        if (xhr.status !== 200) {
            throw new Error(`[Bad response] Code: ${xhr.status} Res: ${xhr.responseText}`);
        } else {
            browser.setToken(JSON.parse(xhr.responseText).token);
        }
    });

    this.Given(/^I have a User$/, () => {
        console.warn('User is already here');
    });

    this.Given(/^I have the expired token$/, () => {
        // TODO Написать подмену существующего токена на аналогичный с необходимым значением dateExpired
        const decodedToken = jwt.verify(browser.getToken, config.jwtSecret);
        const newExpDate = new Date().getMinutes() - 1;

        browser.setToken(getNewToken(decodedToken, newExpDate));
    });

    this.When(/^I send GET request to the API$/, () => {
        // TODO написать обращение к API
    });

    this.Then(/^I delete token from local storage$/, () => {
        // TODO убедиться в отсутствии токена
        if (browser.getToken() === null) {
            console.warn('Token was delete from local storage');
        } else {
            throw new Error('Token is still in the local storage!');
        }
    });

    this.Then(/^I have redirect to Sign In page$/, () => {
        // TODO отправить пользователя нахер
    });
};
module.exports = myStepDefinitionsWrapper;