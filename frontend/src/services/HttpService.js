export default class HttpService {

    static apiURL() { return "http://localhost:9000"; }

    static get(url, onSuccess, onError) {
        let token = window.localStorage['user'];
        let header = new Headers();
        if(token !== undefined) {
            header.append('Authorization', `${token}`);
        }

        fetch(url, {
            method: 'GET',
            headers: header
        }).then((resp) => {
            onSuccess(resp.clone().json())
        }).catch((e) => {
            onError(e.message);
        });
    }

    static put(url, data, onSuccess, onError) {
        let header = new Headers();
        let token = window.localStorage['user'];
        if(token !== undefined) {
            header.append('Authorization', `${token}`);
        }
        header.append('Content-Type', 'application/json');

        fetch(url, {
            method: 'PUT',
            headers: header,
            body: JSON.stringify(data)
        }).then((resp) => {
            return resp.json();
        }).then((resp) => {
            if (resp.error) {
                onError(resp.error);
            }
            else {
                onSuccess(resp);
            }
        }).catch((e) => {
            onError(e.message);
        });
    }

    static post(url, data, onSuccess, onError) {
        let header = new Headers();
        let token = window.localStorage['user'];
        if(token !== undefined) {
            header.append('Authorization', `${token}`);
        }
        header.append('Content-Type', 'application/json');

        fetch(url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(data)
        }).then((resp) => {
            return resp.json();
        }).then((resp) => {
            if (resp.error) {
                onError(resp.error);
            }
            else {
                onSuccess(resp);
            }
        }).catch((e) => {
            onError(e.message);
        });
    }

    static remove(url, onSuccess, onError) {
        let header = new Headers();
        let token = window.localStorage['user'];
        if(token !== undefined) {
            header.append('Authorization', `${token}`);
        }

        fetch(url, {
            method: 'DELETE',
            headers: header
        }).then((resp) => { return resp.json() })
            .then((resp) => {
                if (resp.error) {
                    onError(resp.error);
                }
                else {
                    onSuccess(resp)
                }
            }).catch((e) => {
                onError(e.message);
            });
    }

    // static checkIfUnauthorized(res) {
    //     if(res.status == 401) {
    //         return true;
    //     }
    //     return false;
    // }

}