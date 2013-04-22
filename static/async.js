// 1. create a queue
// 2. on load, execute queued calls
//   * what if it never loads? 
//     IE/safari doesnt fire readyState on error.
//     so put an id on the script tag + poll for it? (check 3pjs)
// 3. after load, resolved deferred just passes thru to the loaded function.
//   * this fixes the problem of allowing existing RPs to not change a thing but get async behavior
//   * how do we want to let RPs toggle between sync and async?
//     could be API addition "async:true", or could be, if it's
//     in the <head> then it's sync, if it's in the <body> async?
//   * you might want to force sync or force async, making both
//     really easy and similar is vital.
$(document).ready(function() {



});
