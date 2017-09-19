angular.module('mealApp').factory('UserService',
['$q', '$timeout', '$http',
function ($q, $timeout, $http) {

  // create user variable
  var user = null;

  // return available functions for use in the controllers
  return ({
    isLoggedIn: isLoggedIn,
    getUserStatus: getUserStatus,
    login: login,
    logout: logout,
    register: register,
    getUser: getUser,
    updateUser: updateUser,
    addCard: addCard,
    deleteCard: deleteCard,
    getUserList: getUserList,
    sendMoney: sendMoney,
    getTransactions: getTransactions
  });

  function isLoggedIn() {
    if(user) {
      return true;
    } else {
      return false;
    }
  }

  function getUserStatus() {
    return $http.get('/user/status')
    // handle success
    .then(function (success) {
      if(success.data.status){
        user = true;
      } else {
        user = false;
      }
    })
    // handle error
    .catch(function (error) {
      user = false;
    });
  }

  function login(username, password) {
    
    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/user/login',
      {username: username, password: password})
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          user = true;
          deferred.resolve();
        } else {
          user = false;
          deferred.reject();
        }
      })
      // handle error
      .catch(function (error) {
        user = false;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  function logout() {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a get request to the server
    $http.get('/user/logout')
      // handle success
      .then(function (success) {
        user = false;
        deferred.resolve();
      })
      // handle error
      .catch(function (error) {
        user = false;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  function register(form) {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/user', form)
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .catch(function (data) {
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  function getUser() {
    return $http.get('/user');
  }

  function updateUser(form) {
    // create a new instance of deferred
    var deferred = $q.defer();
    
    // send a post request to the server
    $http.post('/user', form)
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .catch(function (error) {
        deferred.reject(error);
      });

    // return promise object
    return deferred.promise;
  }

  function addCard(form) {
    // create a new instance of deferred
    var deferred = $q.defer();
    
    // send a post request to the server
    $http.post('/user/card', form)
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .catch(function (error) {
        deferred.reject(error);
      });

    // return promise object
    return deferred.promise;
  }

  function deleteCard(cardId, userId) {
    // create a new instance of deferred
    var deferred = $q.defer();
    
    // send a post request to the server
    $http.delete('/user/card?user=' + userId + '&card=' + cardId)
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .catch(function (error) {
        deferred.reject(error);
      });

    // return promise object
    return deferred.promise;
  }

  function getUserList() {
    return $http.get('/user/list');
  }

  function sendMoney(form) {
    // create a new instance of deferred
    var deferred = $q.defer();
    
    // send a post request to the server
    $http.post('/transaction', form)
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .catch(function (error) {
        deferred.reject(error);
      });

    // return promise object
    return deferred.promise;
  }

  function getTransactions() {
    return $http.get('/transaction');
  }

}]);