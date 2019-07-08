import HttpService from "./HttpService";

export default class UserService {

    static baseURL() {return "http://localhost:9000"; }

    // static register(user, pass) {
    //     return new Promise((resolve, reject) => {
    //         HttpService.post(`${UserService.baseURL()}/register`, {
    //             username: user,
    //             password: pass
    //         }, function(data) {
    //             resolve(data);
    //         }, function(textStatus) {
    //             reject(textStatus);
    //         });
    //     });
    // }

    static login(user, pass) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${UserService.baseURL()}`, {
                username: user,
                password: pass
            }, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    // static logout(){
    //     window.localStorage.removeItem('jwtToken');
    // }

    // static getCurrentUser() {
    //     let token = window.localStorage['jwtToken'];
    //     if (!token) return {};

    //     let base64Url = token.split('.')[1];
    //     let base64 = base64Url.replace('-', '+').replace('_', '/');
    //     return {
    //         id : JSON.parse(window.atob(base64)).id,
    //         username: JSON.parse(window.atob(base64)).username
    //     };
    // }

    // static isAuthenticated() {
    //     return !!window.localStorage['jwtToken'];
    // }
}