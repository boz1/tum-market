import HttpService from "./HttpService";

export default class NotificationService {

    static baseURL() { return "http://localhost:9000/notification"; }

    static deleteNotification(userId, id) {
        return new Promise((resolve, reject) => {
            HttpService.remove(`${NotificationService.baseURL()}/${userId}/${id}`,
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

    static readNotifications(userId) {
        let data = { userId: userId };
        return new Promise((resolve, reject) => {
            HttpService.put(`${NotificationService.baseURL()}`, data, function (data) {
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