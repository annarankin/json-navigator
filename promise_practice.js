// var myFirstPromise = new Promise(function(resolve, reject) {
//   window.setTimeout(function() {
//     resolve('hello');
//   }, 1000);
// });

// myFirstPromise.then(function(greeting) {
//   console.log(greeting);
// });

var thingsToDo = ['run', 'hide', 'jump', 'frolic'];

var promises = thingsToDo.map(function(thing) {
  return new Promise(function(resolve, reject) {
    console.log('making h1 tag for ' + thing);
    resolve('<h1>' + thing + '</h1>');
  });
})

Promise.all(promises).then(function() {
  console.log('All done!');
})