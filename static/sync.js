$(document).ready(function() {

var currentUser = null; // WARNING: it's gotta be null, not undefined
var loginFired;

// 1. wire up nav.id callback handlers & start watch()
navigator.id.watch({
  loggedInUser: currentUser,
  onlogin: function(assertion) {
    // verify the assertion
    $.post('/verify', {assertion: assertion},
      function success(email) {
        currentUser = email;
        loginFired = true;
        $('.loading').hide();
        $('.signed-out').hide();
        $('.signed-in').show();
      }
    );
  },
  onlogout: function() {
    currentUser = null;
    loginFired = false;
    $('.loading').hide();
    $('.signed-in').hide();
    $('.signed-out').show();
  },
  // XXX due to browserid bug #3170, have to ignore onmatch if the last
  // callback to fire was onlogin.
  onmatch: function() {
    if (loginFired) return;
    $('.loading').hide();
    $('.signed-in').hide();
    $('.signed-out').show();
  }
});

// 2. wire up DOM handlers
$('.sign-out').click(function(e) {
  e.preventDefault();
  navigator.id.logout();
});
$('.sign-in').click(function(e) {
  e.preventDefault();
  navigator.id.request();
});

});
