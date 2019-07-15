import HttpService from "./HttpService";
import { storage } from '../config/firebaseConfig';

export default class AdService {

    static baseURL() { return "http://localhost:9000/ad"; }

    static deleteAd(ad) {
        console.log(ad)
        return new Promise((resolve, reject) => {
            HttpService.remove(`${AdService.baseURL()}/${ad.userId}/${ad.id}`,
                function (data) {
                    if (data.message !== undefined) {
                        const deleteImageRef = storage.ref(`images/${ad.userId}/${ad.id}/${ad.imageTitle}`)

                        // Delete the file
                        deleteImageRef.delete().then(function () {
                            resolve(data.message);
                        }).catch(function (error) {
                            console.log(error)
                        });
                    }
                    else {
                        reject('Error while deleting');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

    static updateAd(userId, ad, image) {
        return new Promise((resolve, reject) => {
            if (ad.image === "") {
                // Upload Image
                const uploadImage = storage.ref(`images/${userId}/${ad.id}/${ad.imageTitle}`).put(image);

                uploadImage.on('state_changed',
                    (snapshot) => {
                        // progrss function ....
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        console.log("progress " + progress)
                    },
                    (error) => {
                        // error function ....
                        console.log("error " + error);
                    },
                    () => {
                        // complete function ....
                        storage.ref(`images/${userId}/${ad.id}/${ad.imageTitle}`).getDownloadURL().then(url => {
                            // Insert to databse

                            ad.image = url;

                            let data = { userId: userId, ad: ad }

                            HttpService.put(AdService.baseURL(), data, function (data) {
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
                    });
            }
            else {
                let data = { userId: userId, ad: ad }

                HttpService.put(AdService.baseURL(), data, function (data) {
                    if (data.message !== undefined) {
                        resolve(data.message);
                    }
                    else {
                        reject('Error while updating');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
            }

        })
    }

    static createKey(id) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${AdService.baseURL()}/${id}`, {},
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }
}