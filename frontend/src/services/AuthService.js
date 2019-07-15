import HttpService from "./HttpService";

export default class AuthService {

    static baseURL() { return "http://localhost:9000/auth"; }

    static login(email, password) {
        let data = {email: email, password: password}
        return new Promise((resolve, reject) => {
            HttpService.post(`${AuthService.baseURL()}/login`, data,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getUser() {
        return new Promise((resolve, reject) => {
            HttpService.get(`${AuthService.baseURL()}/user`,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static signup(email, password, newUser) {
        let data = {email: email, password: password, newUser: newUser}
        return new Promise((resolve, reject) => {
            HttpService.post(`${AuthService.baseURL()}/signup`, data,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static logout() {
        return new Promise((resolve, reject) => {
            HttpService.get(`${AuthService.baseURL()}/logout`,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }
}