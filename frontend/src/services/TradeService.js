import HttpService from "./HttpService";

export default class TradeService {

    static baseURL() { return "http://localhost:9000/trade"; }

    static deleteSentReq(ad) {
        return new Promise((resolve, reject) => {
            HttpService.remove(`${TradeService.baseURL()}/sent/${ad.userId}/${ad.id}/${ad.user.name}/${ad.title}`,
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
}