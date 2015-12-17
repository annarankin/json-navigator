// Function 
var renderInteractiveJSON = function renderInteractiveJSON($target, parentKey, offset, top) {
  var parentKey = parentKey || "root";
  var $rootDiv = $('<div>');
  $rootDiv.addClass("wrapper");
  var offset = offset || 40;
  var top = top || 10;
  var bracketCounter = bracketCounter || 0;
  var lineCounter = 1;
  var $target = $target || $(document.body);
  var lineHeight = 25;


  // Internal functions
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
  var addNewBracket = function(bracketString, bracketId, parentKey, $parentDiv) {

    var $bracket = $('<p>');
    // Is bracket a beginning bracket?
    if (bracketString === "[" || bracketString === "{") {
      $bracket.html("<span class='key'>" + parentKey + '</span>: <span class="bracket ' + bracketId + '">' + bracketString + '</span>');
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
    $parentDiv.append($bracket);
    // lineCounter = addLineNum(lineCounter);

  };

// Function to be returned on invocation of renderInteractiveJSON
  var displayObject = function(obj, parentKey, $parentDiv) {

    var $parentDiv = $parentDiv || $rootDiv;
    // Create a new div with a class of the parent key's name.
    var $childDiv = $('<div>');
    $childDiv.addClass(parentKey);

    // If the "obj" argument is not an object, just display it as a key/value pair.
    if (typeof obj != "object") {
      var $displayParagraph = $('<p>');

      if (typeof obj === "string") {
        var paragraphHTML = "<span class='key'>" + parentKey + '</span>: <span class="value">"' + obj + '"</span>,'
      } else {
        var paragraphHTML = "<span class='key'>" + parentKey + '</span>: <span class="value">' + obj + '</span>,'
      }


      $displayParagraph.html(paragraphHTML);
      $displayParagraph.css({
        position: "absolute"
      });
      $displayParagraph.offset({
        top: top,
        left: offset
      });
      $childDiv.append($displayParagraph);
      // lineCounter = addLineNum(lineCounter);
      // Otherwise, if it's an array, indent and loop through it, 
      // displaying everything inside. 
    } else if (Array.isArray(obj)) {

      var bracketId = bracketCounter;
      bracketCounter++;

      addNewBracket("[", bracketId, parentKey, $childDiv);
      offset += lineHeight;
      top += lineHeight;

      // Recursively go through every element in array, call self for each
      obj.forEach(function(el, idx) {
        displayObject(el, idx, $parentDiv);
      });

      addNewBracket("]", bracketId, parentKey, $childDiv);
      offset -= lineHeight;

      // If obj is actually a JS object, display each key-value pair.
    } else if (typeof obj === "object") {
      var bracketId = bracketCounter;
      bracketCounter++;

      addNewBracket("{", bracketId, parentKey, $childDiv);
      offset += lineHeight;
      top += lineHeight;

      var keys = Object.keys(obj);

      keys.forEach(function(key) {
        displayObject(obj[key], key, $childDiv);
      });

      addNewBracket("}", bracketId, parentKey, $childDiv);
      offset -= lineHeight;

    }
    top += lineHeight;
    $parentDiv.append($childDiv);
  };
  // Empty out the target element
  $target.empty();
  $target.append($rootDiv);

  return displayObject;
}

var addBracketPairListeners = function() {
  var $allBrackets = $(".bracket");
  $allBrackets.each(function(idx, bracket) {
    $(bracket).on('mouseenter', function(event) {
      var bracketClass = $(event.target).attr("class").split(' ')[1]
      var $matchingBrackets = $("." + bracketClass);
      $matchingBrackets.addClass('highlighted');
    });
    $(bracket).on('mouseleave', function(event) {
      var bracketClass = $(event.target).attr("class").split(' ')[1]
      var $matchingBrackets = $("." + bracketClass)
      $matchingBrackets.removeClass('highlighted');
    });
  });
};

$(document).ready(function() {
  $('button').on('click', function(e) {
      objToDisplay = JSON.parse($('#json-input').val());
      renderInteractiveJSON($('.results'))(objToDisplay, "root");
      addBracketPairListeners();
    });
});