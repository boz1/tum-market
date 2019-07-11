import HttpService from "./HttpService";

export default class TradeService {

    static baseURL() { return "http://localhost:9000/trade"; }

    static deleteSentReq(ad, type) {
        let title, username,sellerId;

        if(type==="req"){
            title = "-";
            username = ad.username;
            sellerId = ad.sellerId;
        }else{
            title = ad.title;
            username = ad.user.name;
            sellerId = "-"
        }

        return new Promise((resolve, reject) => {
            HttpService.remove(`${TradeService.baseURL()}/sent/${ad.userId}/${ad.id}/${username}/${title}/${type}/${sellerId}`,
                function (data) {
                    if (data.message !== undefined) {
                        resolve(data.message);
                    }
                    else {
                        reject('Error while deleting');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static deleteReceivedReq(ad) {
        return new Promise((resolve, reject) => {
            HttpService.remove(`${TradeService.baseURL()}/received/${ad.userId}/${ad.id}/${ad.user.name}/${ad.title}`,
                function (data) {
                    if (data.message !== undefined) {
                        resolve(data.message);
                    }
                    else {
                        reject('Error while deleting');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static sendTradeReq(ad, user, itemId) {
        let data = { ad: ad, user: user, itemId: itemId }
        return new Promise((resolve, reject) => {
            HttpService.post(TradeService.baseURL(), data, function (data) {
                if (data.message !== undefined) {
                    resolve(data.message);
                }
                else {
                    reject('Error while creating');
                }
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }

    static getTradeReq(ad) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${TradeService.baseURL()}/${ad.userId}/${ad.id}`,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getReceivedItem(item) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${TradeService.baseURL()}/received/${item.buyerId}/${item.receivedItemId}/${item.userId}/${item.sentItemId}`,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static getSentItem(item) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${TradeService.baseURL()}/sent/${item.sellerId}/${item.targetItemId}/${item.userId}/${item.offeredItemId}`,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static updateStatus(item, user, title, status) {
        let data = { item: item, user: user, title: title, status: status }
        return new Promise((resolve, reject) => {
            HttpService.post(`${TradeService.baseURL()}/updateStatus`, data, function (data) {
                if (data.message !== undefined) {
                    resolve(data.message);
                }
                else {
                    reject('Error while updating');
                }
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }
}