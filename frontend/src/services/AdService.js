import HttpService from "./HttpService";
import { storage } from '../config/firebaseConfig';

export default class AdService {

    static baseURL() { return "http://localhost:9000/ad"; }

    static deleteAd(ad) {
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

    static createAd(key, userId, ad, image) {
        return new Promise((resolve, reject) => {
            // Upload Image
            const uploadImage = storage.ref(`images/${userId}/${key}/${ad.imageTitle}`).put(image);

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
                    storage.ref(`images/${userId}/${key}/${ad.imageTitle}`).getDownloadURL().then(url => {
                        // Insert to databse

                        ad.image = url;

                        let data = { key: key, userId: userId, ad: ad }

                        HttpService.post(AdService.baseURL(), data, function (data) {
                            if (data.message !== undefined) {
                                resolve(data.message);
                            }
                            else {
                                reject('Error while creating');
                            }
                        }, function (textStatus) {
                            reject(textStatus);
                        });
                    })
                });
        })
    }

    static getKey(id) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${AdService.baseURL()}/${id}`,
                function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }
}