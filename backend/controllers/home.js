"use strict";

const firebase = require('../firebaseConfig')

const getMainContent = (req, res) => {
  let categoriesRef, subCategoriesRef, conditionsRef, adsRef, usersRef, buyRef;
  let obj = {};

  new Promise((resolve) => {
    categoriesRef = firebase.database().ref('categories')
    categoriesRef.on('value', snap => {
      let data = obj;
      data.categories = snap.val()
      obj = data;
      resolve(obj)
    })
  })
    .then((obj) => {
      return new Promise((resolve) => {
        subCategoriesRef = firebase.database().ref('sub-categories')
        subCategoriesRef.on('value', snap => {
          let data = obj;
          data.subCategories = snap.val()
          obj = data;
          resolve(obj)
        })
      })
    })
    .then((obj) => {
      return new Promise((resolve) => {
        conditionsRef = firebase.database().ref('conditions')
        conditionsRef.on('value', snap => {
          let data = obj;
          data.conditions = snap.val()
          obj = data;
          resolve(obj)
        })
      })
    })
    .then((obj) => {
      return new Promise((resolve) => {
        adsRef = firebase.database().ref('advertisements')
        adsRef.on('value', snap => {
          let data = obj;
          data.ads = snap.val()
          obj = data;
          resolve(obj)
        })
      })
    })
    .then((obj) => {
      return new Promise((resolve) => {
        buyRef = firebase.database().ref('buying-requests')
        buyRef.on('value', snap => {
          let data = obj;
          data.buyreqs = snap.val()
          obj = data;
          resolve(obj)
        })
      })
    })
    .then((obj) => {
      return new Promise((resolve) => {
        usersRef = firebase.database().ref('users')
        usersRef.on('value', snap => {
          let data = obj;
          data.users = snap.val()
          obj = data;
          resolve(obj)
        })
      })
    })
    .then((obj) => {
      res.status(200).json({ obj });
      // categoriesRef.off('value')
      // categoriesRef = null;

      // subCategoriesRef.off('value')
      // subCategoriesRef = null;

      // conditionsRef.off('value')
      // conditionsRef = null;

      // adsRef.off('value')
      // adsRef = null;

      // usersRef.off('value')
      // usersRef.off('value')
    })
    .catch((er) => {
      console.log(er)
    });
};

const getUserContent = (req, res) => {
  const id = req.params.id;
  let userRef, userAdsRef, userBuyReqRef, userTradeReqRefSent, userTradeReqRefReceived;
  let obj = {};

  new Promise((resolve) => {
    userRef = firebase.database().ref('users').child(id)
    userRef.on('value', snap => {
      let data = obj;
      data.info = snap.val()
      obj = data;
      resolve(obj)
    })
  })
    .then((obj) => {
      return new Promise((resolve) => {
        userAdsRef = firebase.database().ref('advertisements').child(id)
        userAdsRef.on('value', snap => {
          let data = obj;
          data.ads = snap.val()
          obj = data;
          resolve(obj)
        })
      })

    })
    .then((obj) => {
      return new Promise((resolve) => {
        userBuyReqRef = firebase.database().ref('buying-requests').child(id)
        userBuyReqRef.on('value', snap => {
          let data = obj;
          data.buyreqs = snap.val()
          obj = data;
          resolve(obj)
        })
      })
    })
    .then((obj) => {
      return new Promise((resolve) => {
        userTradeReqRefSent = firebase.database().ref('trade-requests').child(id)
        userTradeReqRefSent.on('value', snap => {
          let data = obj;
          var reqs = [];
          snap.forEach(ss => {
            reqs.push(ss.val());
          });
          data.tradeReq = reqs;
          obj = data;
          resolve(obj)
        })
      })
    })
    .then((obj) => {
      return new Promise((resolve) => {
        userTradeReqRefReceived = firebase.database().ref('received-offers').child(id)
        userTradeReqRefReceived.on('value', snap => {
          let data = obj;
          var reqs = [];
          snap.forEach(ss => {
            reqs.push(ss.val());
          });
          data.receivedOffers = reqs;
          obj = data;
          resolve(obj)
        })
      })
    })
    .then((obj) => {
      res.status(200).json({ obj });

      userAdsRef.off('value')
      userAdsRef = null;

      userBuyReqRef.off('value')
      userBuyReqRef = null;

      userTradeReqRefSent.off('value')
      userTradeReqRefSent = null;

      userTradeReqRefReceived.off('value')
      userTradeReqRefReceived = null;
    })
    .catch((er) => {
      console.log(er)
    });
};

module.exports = {
  getMainContent,
  getUserContent
};