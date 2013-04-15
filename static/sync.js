$(document).ready(function() {

var currentUser = null; // WARNING: it's gotta be null, not undefined

// 1. wire up nav.id callback handlers & start watch()
navigator.id.watch({
  loggedInUser: currentUser,
  onlogin: function(assertion) {
    // verify the assertion
    $.post('/verify', {assertion: assertion},
      success: function(email) {
        currentUser = email;
        $('loading').hide();
        $('sign-out').toggle();
        $('sign-in').toggle();
      }
    );
  },
  onlogout: function() {
    currentUser = null;
    $('loading').hide();
    $('sign-out').toggle();
    $('sign-in').toggle();
  }
});

// 2. wire up DOM handlers
$('sign-out').click(function(e) {
  e.preventDefault();
  navigator.id.logout();
});
$('sign-in').click(function(e) {
  e.preventDefault();
  navigator.id.request();
});
