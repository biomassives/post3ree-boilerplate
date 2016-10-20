/**
 * Created by nemaeska on 17.10.16.
 */

import XHR from 'xmlhttprequest';
import jwt from 'jsonwebtoken';
import config from 'config';

import Browser from '../../utils/Browser';

const XMLHttpRequest = XHR.XMLHttpRequest;

export const myStepDefinitionsWrapper = function stepDefinition() {
    const browser = Browser.instance;

    function getNewToken(decoded, expDate) {
        return jwt.sign({
            sub: decoded.sub,
            role: decoded.role,
            expDate: new Date().setMinutes(expDate)
        }, config.jwtSecret);
    }
    function checkDateDelta(minutes, decoded, currentServerDate) {
        const delta = Math.floor((new Date(decoded.expDate) - currentServerDate) / (60 * 1000));
        if (minutes !== delta) {
            throw new Error('Тест упал');
        }
        return true;
    }

    this.Given(/^I have an empty DB$/, () => {
        console.warn('[x22a] Well it is given');
    });

    this.When(/^I send POST request to register with (.*) and (.*)$/, (email, password) => {
        const xhr = new XMLHttpRequest();

        const user = JSON.stringify({ user: {
            username: email,
            password,
            role: 'user'
        }
        });

        xhr.open('POST', `http://${config.express.host}:${config.express.port}/openapi/v1/register`, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(user);

        if (xhr.status !== 200) {
            throw new Error(`[Bad response] Code: ${xhr.status} Res: ${xhr.responseText}`);
        } else {
            browser.setId(JSON.parse(xhr.responseText).id);
        }
    });

    this.And(/^I send POST request to login with checkbox: (.*) username: (.*) and password: (.*)$/, (checkbox, username, password) => {
        const xhr = new XMLHttpRequest();

        const user = JSON.stringify({
            user: {
                username,
                password
            },
            checkbox
        });

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
        checkDateDelta(minutes, decodedToken, currentServerDate);
    });

    this.Given(/^I have a User with checkbox: (.*)$/, checkbox => {
        console.warn(`user push checkbox: ${checkbox}`); // а юзер точно есть?
    });

    this.And(/^I have a token with an expiration date for (.*) minutes the most current date on the server or equal to it$/, delta => {
        // TODO Написать подмену существующего токена на аналогичный с необходимым значением dateExpired
        const decodedToken = jwt.verify(browser.getToken, config.jwtSecret);
        const newExpDate = new Date().getMinutes() + delta;

        browser.setToken(getNewToken(decodedToken, newExpDate));
    });

    this.When(/^I send GET request to the API$/, () => {
        // TODO написать обращение к API
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `http://${config.express.host}:${config.express.port}/api/v1/echo`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();

        if (xhr.status !== 200) {
            throw new Error(`[Bad response] Code: ${xhr.status} Res: ${xhr.responseText}`);
        } else {
            browser.setToken(JSON.parse(xhr.responseText).token);
        }
    });

    this.Then(/^I get a new valid JWT token with an expiration date of (.*) minutes after the current date on the server$/, minutes => {
        // TODO Написать проверку нового только что полученного токена
        const decodedToken = jwt.verify(browser.getToken(), config.jwtSecret);
        const currentServerDate = new Date();

        checkDateDelta(minutes, decodedToken, currentServerDate);
    });

    this.Given(/^I have a User$/, () => {
        console.warn('User is already here');
    });

    this.And(/^I have the expired token$/, () => {
        // TODO Написать подмену существующего токена на аналогичный с необходимым значением dateExpired
        const decodedToken = jwt.verify(browser.getToken, config.jwtSecret);
        const newExpDate = new Date().getMinutes() - 1;

        browser.setToken(getNewToken(decodedToken, newExpDate));
    });

    this.When(/^I send GET request to the API$/, () => {
        // TODO написать обращение к API
    });

    this.Then(/^I delete token from local storage$/, () => {
        // TODO удалить токен
    });

    this.And(/^I have redirect to Sign In page$/, () => {
        // TODO отправить пользователя нахер
    });
};