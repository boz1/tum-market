import HttpService from "./HttpService";

export default class BuyingRequestService {

    static baseURL() { return "http://localhost:9000/buy"; }

    static deleteBuyingRequest(buy) {
        return new Promise((resolve, reject) => {
            HttpService.remove(`${BuyingRequestService.baseURL()}/${buy.userId}/${buy.id}`,
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

    static updateBuyingRequest(userId, buy) {
        return new Promise((resolve, reject) => {
            let data = { userId: userId, buy: buy }

            HttpService.put(BuyingRequestService.baseURL(), data, function (data) {
                if (data.message !== undefined) {
                    resolve(data.message);
                }
                else {
                    reject('Error while updating');
                }
            }, function (textStatus) {
                reject(textStatus);
            });
        })
    }

    static createKey(id) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${BuyingRequestService.baseURL()}/${id}`, {},
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }
}