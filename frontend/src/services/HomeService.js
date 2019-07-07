"use strict";

import HttpService from "./HttpService";

export default class UserService {

    constructor() {
    }

    static baseURL() { return "http://localhost:9000"; }

    static getMainContent() {
        return new Promise((resolve, reject) => {
            HttpService.get(`${UserService.baseURL()}`,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getUserContent(user) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${UserService.baseURL()}/${user.uid}`,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }
}