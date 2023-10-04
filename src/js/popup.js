let app = angular.module('popupApp', []);
let scope;
chrome.storage.sync.clear();

app.controller('popupAppController', async function ($scope) {
  chrome.storage.local.get('websiteList', ({websiteList}) => {
    if (typeof(websiteList) == "undefined" || websiteList === null || !(websiteList instanceof Array)) {
      websiteList = new Array();
    }
    $scope.websiteList = websiteList;
    $scope.$apply();
  });

  $scope.submit = function() {
    if ($scope.website === null || $scope.website.trim() === "") {
      alert("Please enter the correct url");
      return;
    }
    if ($scope.websiteList.indexOf($scope.website) > -1) {
      alert("The website is exist!");
      return;
    }
    $scope.websiteList.push($scope.website);
    chrome.storage.local.set({'websiteList' : $scope.websiteList });
  }

  $scope.removeWebsite = function(website) {
    $scope.websiteList.remove(website);
    chrome.storage.local.set({'websiteList' : $scope.websiteList });
  }

});

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};