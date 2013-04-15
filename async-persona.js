<!doctype html>
<title>async persona ftw</title>
<style>
.loading, .signed-in, .signed-out {
  width: 300px;
  border: 1px solid black;
}
/* hide these states initially */
.signed-in, .signed-out { display: none; }
</style>
<script src="https://login.persona.org/include.js"></script>
<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script>
$(document).ready(function() {

var currentUser = null; // WARNING: it's gotta be null, not undefined

// 1. wire up nav.id callback handlers & start watch()
navigator.id.watch({
  loggedInUser: currentUser,
  onlogin: function(assertion) {
    // verify the assertion
    $.post('/verify', {assertion: assertion},
      success: onValidAssertion,
      error: onAssertionFailure
    );

  },
  onlogout: function() {
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

</script>
<div class="loading">Loading...</div>
<div class="signed-in">Status: signed in. <a href="/" class="sign-out">Click to sign out.</a></div>
<div class="signed-out">Status: signed out. <a href="/" class="sign-in">Click to sign in.</a></div>

