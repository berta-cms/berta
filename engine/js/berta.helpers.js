window.BertaHelpers = (function () {
  return {

    /**
     * Logout user by reloading the page
     */
    logoutUser: function () {
      if (window.parent === window) {
        window.location.reload();
      } else {
        window.parent.postMessage('user:logout', '*');
      }
    }
  };
})();
