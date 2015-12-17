// Function 
var displayObjectDom = function displayObjectDom($target, parent, offset, top) {
  var parent = parent || "root";
  var offset = offset || 40;
  var top = top || 10;
  var bracketCounter = bracketCounter || 0;
  var lineCounter = 1;
  var $target = $target || $(document.body);
  var lineHeight = 25;
  var addLineNum = function(lineNum) {
    var $lineNumPTag = $('<p class="line-num">');
    $lineNumPTag.text(lineNum.toString());
    $lineNumPTag.css({
      position: "absolute"
    });
    $lineNumPTag.offset({
      top: top,
      left: 5
    });
    $target.append($lineNumPTag);
    return lineNum += 1;
  };
  var addNewBracket = function(bracketString, bracketId, parent) {

    var $bracket = $('<p>');
    // Is bracket a beginning bracket?
    if (bracketString === "[" || bracketString === "{") {
      $bracket.html("<span class='key'>" + parent + '</span>: <span class="bracket ' + bracketId + '">' + bracketString + '</span>');
      // If it's the last, indent it closer to the left
      $bracket.offset({
        top: top,
        left: offset
      });
      // Is bracket an ending bracket?
    } else {
      // Is it not the last bracket? 
      if (bracketId != 0) {
        $bracket.html('<span class="bracket ' + bracketId + '">' + bracketString + '</span>,');
      // Is it the last bracket?
      } else {
        $bracket.html('<span class="bracket ' + bracketId + '">' + bracketString + '</span>');
      }
      // If it's the last, indent it closer to the left
      $bracket.offset({
        top: top,
        left: offset - 20
      });
    }
    $bracket.css({
      position: "absolute"
    });
    $target.append($bracket);
    lineCounter = addLineNum(lineCounter);

  };

  var displayObject = function(obj, parent) {
    // If the "obj" argument is not an object, just display it as a key/value pair.
    if (typeof obj != "object") {
      var $displayParagraph = $('<p>');

      $displayParagraph.html("<span class='key'>" + parent + '</span>: <span class="value">' + obj + '</span>,');
      $displayParagraph.css({
        position: "absolute"
      });
      $displayParagraph.offset({
        top: top,
        left: offset
      });
      $target.append($displayParagraph);
      lineCounter = addLineNum(lineCounter);
      // Otherwise, if it's an array, indent and loop through it, 
      // displaying everything inside. 
    } else if (Array.isArray(obj)) {

      var bracketId = bracketCounter;
      bracketCounter++;

      addNewBracket("[", bracketId, parent);
      offset += lineHeight;
      top += lineHeight;

      // Recursively go through every element in array, call self for each
      obj.forEach(function(el, idx) {
        displayObject(el, idx);
      });

      addNewBracket("]", bracketId, parent);
      offset -= lineHeight;

      // If obj is actually a JS object, display each key-value pair.
    } else if (typeof obj === "object") {
      var bracketId = bracketCounter;
      bracketCounter++;

      addNewBracket("{", bracketId, parent);
      offset += lineHeight;
      top += lineHeight;

      var keys = Object.keys(obj);

      keys.forEach(function(key) {
        displayObject(obj[key], key);
      });

      addNewBracket("}", bracketId, parent);
      offset -= lineHeight;

    }
    top += lineHeight;
  };
  return displayObject;
}

var addBracketPairListeners = function() {
  var $allBrackets = $(".bracket");
  $allBrackets.each(function(idx, bracket) {
    $(bracket).on('mouseenter', function(event) {
      var bracketClass = $(event.target).attr("class").split(' ')[1]
      var $matchingBrackets = $("." + bracketClass);
      $matchingBrackets.addClass('highlighted');
      console.log($matchingBrackets);
    });
    $(bracket).on('mouseleave', function(event) {
      var bracketClass = $(event.target).attr("class").split(' ')[1]
      var $matchingBrackets = $("." + bracketClass)
      $matchingBrackets.removeClass('highlighted');
    });
  });
};

$(document).ready(function() {
  $('button').on('click', function() {
      objToDisplay = JSON.parse($('#json-input').val());
      displayObjectDom($('.results'))(objToDisplay, "root");
      addBracketPairListeners();
    })
    // displayObjectDom()(exampleObj2);

});