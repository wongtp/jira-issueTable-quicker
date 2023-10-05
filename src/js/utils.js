const utils = {
  format : (pattern, ...arguments) => {
      var args = Array.prototype.slice.call(arguments);
      return pattern.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
  },
  getCookie : cookieName => {
    var strCookie = document.cookie
    var cookieList = strCookie.split(';')
    for (var i = 0; i < cookieList.length; i++) {
      var arr = cookieList[i].split('=')
      if (cookieName === arr[0].trim()) {
        return arr[1]
      }
    }
    return '';
  }
}
