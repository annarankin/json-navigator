var exampleObj1 = {
  name: "Anna",
  age: 1,
  friends: [
    "billy",
    "bob",
    "joe"
  ]
};

var exampleObj2 = {
  "glossary": {
    "title": "example glossary",
    "GlossDiv": {
      "title": "S",
      "GlossList": {
        "GlossEntry": {
          "ID": "SGML",
          "SortAs": "SGML",
          "GlossTerm": "Standard Generalized Markup Language",
          "Acronym": "SGML",
          "Abbrev": "ISO 8879:1986",
          "GlossDef": {
            "para": "A meta-markup language, used to create markup languages such as DocBook.",
            "GlossSeeAlso": ["GML", "XML"]
          },
          "GlossSee": "markup"
        }
      }
    }
  }
}


// // Function to display a JSON object, line-by-line in console
// var displayObject = function displayObject(obj, parent, offset) {
//   var parent = parent || "0";
//   var offset = offset || " ";

//   // If the "obj" argument is not an object, just display it as a key/value pair.
//   if (typeof obj != "object") {

//     console.log(offset + parent + ': ' + obj);

//     // Otherwise, if it's an array, indent and loop through it, 
//     // displaying everything inside. 
//   } else if (Array.isArray(obj)) {
//     console.log(offset + parent, '[');
//     offset += "  "
//     obj.forEach(function(el, idx) {
//       displayObject(el, idx, offset);
//     });
//     offset = offset.slice(0, -2)
//     console.log(offset + "],");

//     // If obj is actually a JS object, display each key-value pair.
//   } else if (typeof obj === "object") {
//     console.log(offset + parent + ': {');
//     offset += "  "

//     var keys = Object.keys(obj);

//     keys.forEach(function(key) {
//       displayObject(obj[key], key, offset);
//     });
//     offset = offset.slice(0, -2)

//     console.log(offset + "}");

//     // If none of the above is true...
//   } else {
//     console.log("What")
//   }
// }


// var displayObject = function(obj) {
//   // get all keys/values at first level
//   var firstLevelKeys = Object.keys(obj);
//   var level = 1;
//   // loop through keys, creating a p tag for each
//   firstLevelKeys.forEach(function(keyName) {
//     var $keyValPair = $('<p>');
//     $keyValPair.addClass('level-' + level);

//     var $key = $('<span class="key">');
//     $key.data('name', keyName);
//     $key.text(keyName);
//     console.log($key);

//     var $pairValue = $('<span class="value">');
//     $pairValue.data('name', obj[keyName]);
//     $pairValue.text(obj[keyName]);

//     $keyValPair.append($key);
//     $keyValPair.append(" : ");
//     $keyValPair.append($pairValue);
//     $(document.body).append($keyValPair);
//     $(document.body).append("<br>");
//   });
// };


// Function to display a JSON object, line-by-line on the DOM


var displayObjectDom = function displayObjectDom(parent, offset, top, counter, $target) {
  var parent = parent || "0";
  var offset = offset || 10;
  var top = top || 10;
  var counter = counter || 0;
  var $target = $target || $(document.body);

  var displayObject = function(obj, parent) {
    // If the "obj" argument is not an object, just display it as a key/value pair.
    if (typeof obj != "object") {
      var $displayParagraph = $('<p>');

      $displayParagraph.html("<span class='key'>" + parent + '</span>: <span class="value">' + obj + '</span>');
      $displayParagraph.css({
        position: "absolute"
      });
      $displayParagraph.offset({
        top: top,
        left: offset
      });
      $target.append($displayParagraph);
      // Otherwise, if it's an array, indent and loop through it, 
      // displaying everything inside. 
    } else if (Array.isArray(obj)) {

      var bracketId = counter;
      counter++;

      var $beginBracket = $('<p>');
      $beginBracket.html("<span class='key'>" + parent + '</span>: [' + bracketId);
      $beginBracket.css({
        position: "absolute"
      });
      $beginBracket.offset({
        top: top,
        left: offset
      });
      console.log($beginBracket);
      $target.append($beginBracket);
      offset += 20;
      top += 20;

      obj.forEach(function(el, idx) {
        displayObject(el, idx);
      });

      var $endBracket = $('<p>');
      $endBracket.text("],");
      $endBracket.css({
        position: "absolute"
      });
      $endBracket.offset({
        top: top,
        left: offset
      });

      console.log($endBracket);
      $target.append($endBracket);
      offset -= 20;

      // If obj is actually a JS object, display each key-value pair.
    } else if (typeof obj === "object") {
      var bracketId = counter;
      counter++;

      // console.log(offset + parent + ': {');
      var $beginBracket = $('<p>');
      $beginBracket.html("<span class='key'>" + parent + '</span>: {' + bracketId);
      $beginBracket.css({
        position: "absolute"
      });
      $beginBracket.offset({
        top: top,
        left: offset
      });
      console.log($beginBracket);
      $target.append($beginBracket);
      offset += 20;
      top += 20;

      var keys = Object.keys(obj);

      keys.forEach(function(key) {
        displayObject(obj[key], key);
      });
      // console.log(offset + "}");
      var $endBracket = $('<p>');
      $endBracket.text("}," + bracketId);
      $endBracket.css({
        position: "absolute"
      });
      $endBracket.offset({
        top: top,
        left: offset
      });
      console.log($endBracket);
      $target.append($endBracket);
      offset -= 20;
    }
    top += 20;
  };
  return displayObject;
}



$(document).ready(function() {
  $('button').on('click', function() {
    objToDisplay = JSON.parse($('#json-input').val());
    console.log(objToDisplay);
    displayObjectDom(0, 10, 10, 0, $('.results'))(objToDisplay);
  })
  // displayObjectDom()(exampleObj2);

});