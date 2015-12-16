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


// Function 
var displayObjectDom = function displayObjectDom($target, parent, offset, top, counter) {
  var parent = parent || "root";
  var offset = offset || 10;
  var top = top || 10;
  var counter = counter || 0;
  var $target = $target || $(document.body);
  var lineHeight = 25;

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
      $beginBracket.html("<span class='key'>" + parent + '</span>: <span class="bracket ' + bracketId + '">[</span>');
      $beginBracket.css({
        position: "absolute"
      });
      $beginBracket.offset({
        top: top,
        left: offset
      });
      console.log($beginBracket);
      $target.append($beginBracket);
      offset += lineHeight;
      top += lineHeight;

      obj.forEach(function(el, idx) {
        displayObject(el, idx);
      });

      var $endBracket = $('<p>');
      $endBracket.html('<span class="bracket ' + bracketId + '">]</span>');
      $endBracket.css({
        position: "absolute"
      });
      $endBracket.offset({
        top: top,
        left: offset - lineHeight
      });

      console.log($endBracket);
      $target.append($endBracket);
      offset -= lineHeight;

    // If obj is actually a JS object, display each key-value pair.
    } else if (typeof obj === "object") {
      var bracketId = counter;
      counter++;

      var $beginBracket = $('<p>');
      $beginBracket.html("<span class='key'>" + parent + '</span>: <span class="bracket ' + bracketId + '">{</span>');
      $beginBracket.css({
        position: "absolute"
      });
      $beginBracket.offset({
        top: top,
        left: offset
      });
      console.log($beginBracket);
      $target.append($beginBracket);
      offset += lineHeight;
      top += lineHeight;

      var keys = Object.keys(obj);

      keys.forEach(function(key) {
        displayObject(obj[key], key);
      });
      var $endBracket = $('<p>');
      $endBracket.html('<span class="bracket ' + bracketId + '">}</span>');
      $endBracket.css({
        position: "absolute"
      });
      $endBracket.offset({
        top: top,
        left: offset - lineHeight
      });
      console.log($endBracket);
      $target.append($endBracket);
      offset -= lineHeight;
    }
    top += lineHeight;
  };
  return displayObject;
}

var addBracketPairListeners = function() {};

$(document).ready(function() {
  $('button').on('click', function() {
    objToDisplay = JSON.parse($('#json-input').val());
    console.log(objToDisplay);
    displayObjectDom($('.results'))(objToDisplay, "root");
    addBracketPairListeners();
  })
  // displayObjectDom()(exampleObj2);

});