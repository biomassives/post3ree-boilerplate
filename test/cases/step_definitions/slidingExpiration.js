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

    let error = false;

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

    this.Then(/^I get valid JWT token with an expiration date of (.*) hours after the current date on the server$/, hours => {
        // TODO Написать проверку для поля dateExpired
        const decodedToken = jwt.verify(browser.getToken(), config.jwtSecret);
        const currentServerDate = new Date();
        function checkDateDelta(decoded) {
            const delta = Math.floor((new Date(decoded.expDate) - currentServerDate) / (60 * 60 * 1000));
            if (hours !== delta) {
                throw new Error('Тест упал');
            }
            return true;
        }
        checkDateDelta(decodedToken);
    });

    this.Given(/^I have a User$/, () => {
        console.log('Yeah, User is here');
    });

    this.And(/^I have a token with an expiration date for 5 days the most current date on the server or equal to it$/, () => {
        // TODO Написать подмену существующего токена на аналогичный с необходимым значением dateExpired
        const decodedToken = jwt.verify(browser.getToken, config.jwtSecret);
        const newExpDate = decodedToken.expDate.getDate() + 5;

        function getNewToken(decoded, expDate) {
            return jwt.sign({
                sub: decoded.sub,
                role: decoded.role,
                expDate: new Date().setDate(expDate)
            }, config.jwtSecret);
        }

        browser.setToken(getNewToken(decodedToken, newExpDate));
    });

    this.When(/^I send GET request to the API$/, () => {
        // TODO написать обращение к API
    });

    this.Then(/^I get new valid JWT token with an expiration date of 30 days after the current date on the server$/, () => {
        // TODO Написать замену "старого" токена на новый
    });

    this.Given(/^I have a User$/, () => {
        // ????
    });

    this.And(/^I have the expired token$/, () => {
        // TODO Написать подмену существующего токена на аналогичный с необходимым значением dateExpired
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