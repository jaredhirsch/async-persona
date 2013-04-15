$(document).ready(function() {

var currentUser = null; // WARNING: it's gotta be null, not undefined

// 1. wire up nav.id callback handlers & start watch()
navigator.id.watch({
  loggedInUser: currentUser,
  onlogin: function(assertion) {
    // verify the assertion
    $.post('/verify', {assertion: assertion},
      function success(email) {
        currentUser = email;
        $('.loading').hide();
        $('.signed-out').hide();
        $('.signed-in').show();
      }
    );
  },
  onlogout: function() {
    currentUser = null;
    $('.loading').hide();
    $('.signed-in').hide();
    $('.signed-out').show();
  },
  // if it's a match, we're logged out.
  onmatch: function() {
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
