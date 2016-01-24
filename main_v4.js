// Function to accept a target to render results in & return a render function
var renderInteractiveJSON = function($target) {
  // If no target is given, render into the body of the doc
  var $rootDiv = $('<div>');
  var indent = 0;
  var leftOffset = 25;
  var bracketCounter = 1;
  var lineNumber = 0;
  var $lineNums = $('<div class="line-numbers">');
  $rootDiv.data('id', 'data');
  $target.append($rootDiv);
  $target.append($lineNums);

  var createChildDiv = function(parentKey, leftOffset) {
    // Create a new div with a class of the parent key's name.
    var $childDiv = $('<div>');
    $childDiv.css({
      position: 'relative'
    });
    $childDiv.offset({
      left: leftOffset
    })
    $childDiv.data('id', parentKey.toString());
    return $childDiv;
  };

  var $keyValParagraph = function(key, value, liClass, bracketCounter) {
    // Create the new paragraph that will display info
    var $displayParagraph = $('<p>');

    // Create the HTML string & evaluate what's being displayed
    if (/[\}\]]/.test(value)) {
      var paragraphHTML = '<span class="bracket' + bracketCounter + '">' + value + '</span>,'
    } else if (/[\[\{]/.test(value)) {
      var paragraphHTML = '<span class="minus"></span><span class="key">' + key + '</span>: <span class="bracket' + bracketCounter + '">' + value + '</span>'
    } else if (typeof value === "string") {
      var paragraphHTML = "<span class='key'>" + key + '</span>: <span class="value">"' + value + '"</span>,'
    } else {
      var paragraphHTML = "<span class='key'>" + key + '</span>: <span class="value">' + value + '</span>,'
    }
    $displayParagraph.html(paragraphHTML);
    $displayParagraph.data('id', key);
    $displayParagraph.find('[class^=bracket]').on('mouseenter', function() {
      $('.' + this.classList[0]).addClass('highlighted');
    });
    $displayParagraph.find('[class^=bracket]').on('mouseout', function() {
      $('.' + this.classList[0]).removeClass('highlighted');
    });
    
    var $minus = $displayParagraph.find('[class^=minus]');
    // --- Logic to collapse sections of the data structure ---
    $minus.on('click', function() {
      console.log(key);
      $(this).parent('p').toggleClass('plus');
      var $divToHide = $(this).parent('p').next('div').eq(0);
      $divToHide.toggleClass('collapsed');
      // $('.line-numbers .' + liClass).toggleClass('collapsed');
    });
    var $lineNumberPTag = $('<li>' + lineNumber + '</li>');
    $lineNumberPTag.addClass(liClass);
    $lineNums.append($lineNumberPTag);
    lineNumber++;

    return [$displayParagraph, bracketCounter];
  };

  // Define function that will recursively render a JS object into results div
  var parseAndRenderObject = function(obj, firstKey, $parentDiv, liClass) {
    // The div that'll contain this one
    var $parentDiv = $parentDiv || $rootDiv;
    var parentKey = firstKey || '0';
    var liClass = liClass || parentKey;
    // var left = 0 || left;
    // If the "obj" (value of the key we're evaluating) is not an object, just display it as a key/value pair.
    if (typeof obj != "object") {
      // Create the key:"value"/key:value string
      var $displayParagraph = $keyValParagraph(parentKey, obj, liClass)[0];
      $parentDiv.append($displayParagraph);

      // Otherwise, if it's an array, indent and loop through it, 
      // displaying everything inside. 
    } else if (Array.isArray(obj)) {

      var paragraphInfo = $keyValParagraph(parentKey, '[', liClass, bracketCounter);
      var $displayParagraph = paragraphInfo[0];
      var thisBracket = paragraphInfo[1]
      bracketCounter++;
      $parentDiv.append($displayParagraph);
      leftOffset += indent;
      var $childDiv = createChildDiv(parentKey, leftOffset);
      // Recursively go through every element in array, call self for each
      var promises = obj.map(function(el, idx) {
        return new Promise(function(resolve, reject) {
          resolve(parseAndRenderObject(el, idx, $childDiv, parentKey));
        })
      });
      leftOffset -= indent;
      Promise.all(promises).then(function() {
          var $displayParagraph = $keyValParagraph(null, ']', liClass, thisBracket)[0];
          $childDiv.append($displayParagraph);
        })
        // If obj is actually a JS object, display each key-value pair.
    } else if (typeof obj === "object") {
      // Get all keys for object
      var keys = Object.keys(obj);
      // Add beginning key & bracket
      var paragraphInfo = $keyValParagraph(parentKey, '{', liClass, bracketCounter);
      var $displayParagraph = paragraphInfo[0];
      var thisBracket = paragraphInfo[1];
      bracketCounter++;

      $parentDiv.append($displayParagraph);
      // Increase indentation & apply to child div
      leftOffset += indent;
      var $childDiv = createChildDiv(parentKey, leftOffset);

      keys.map(function(key) {
        return new Promise(function(resolve, reject) {
          resolve(parseAndRenderObject(obj[key], key, $childDiv, parentKey));
        });
      });
      leftOffset -= indent;

      Promise.all(keys).then(function() {
        // Add bracket to final 
        var $displayParagraph = $keyValParagraph(null, '}', liClass, thisBracket)[0];
        $childDiv.append($displayParagraph);
      })
    }
    $parentDiv.append($childDiv);
    return $childDiv;
  };
  return parseAndRenderObject;
};


// Take the user's input & attempt to parse it, then display it
var renderInput = function() {
  try {
    var objToDisplay = JSON.parse($('#json-input').val());
  } catch (e) {
    return displayMsg("Uh-oh! Invalid input: " + e);
  }
  $('.results').empty();
  renderInteractiveJSON($('.results'))(objToDisplay, "data");
  addValueListeners();
  
};

var timerId;
var displayMsg = function(msg) {
  if (timerId) {
    window.clearInterval(timerId);
  }
  var $notice = $('#notice');
  $notice.text(msg);
  $notice.fadeIn(200);
  // Global timerId - clear it
  timerId = window.setTimeout(function() {
    $notice.fadeOut(200);
  }, 2000);
};


var addValueListeners = function() {
  var $allValues = $('.value');
  var $allKeys = $('.key');
  $allValues.on('click', getPathToValue);
  $allKeys.on('click', getPathToValue);
};

// Generate a string path to a value - ex data.example[0][1].name
var getPathToValue = function(event) {
  // Does the user want Ruby code or JS code?
  var outputFormat = $('input:checked').val();
  // find the parents of the event target that are divs
  var $valueParents = $(event.target).parents();
  // find where the div with a class of "root" is located in the returned list
  var resultDivIdx = $valueParents.index($('.results')) - 1;
  // slice the array to remove all dom nodes from the root on up to the body
  var $keyNameDivs = $valueParents.slice(0, resultDivIdx);
  // reduce this array into a string containing the names of all classes.
  var keyNames = Array.prototype.map.call($keyNameDivs, function(div) {
    return $(div).data('id');
  });

  switch (outputFormat) {
    case "render-js":
      if (keyNames.length > 1) {
        var string = keyNames.reverse().reduce(function(prev, curr, idx) {
          if (isNaN(parseInt(curr.toString()))) {
            return prev + "." + curr;
          }
          return prev + "[" + curr + "]";
        });
      } else {
        var key = isNaN(parseInt(keyNames[0].toString())) ? "." + keyNames[0] : "[" + keyNames[0] + "]";
        var string = key;
      }

      break;
    case "render-ruby":
      if (keyNames.length > 1) {
        var string = keyNames.reverse().reduce(function(prev, curr, idx) {
          if (isNaN(parseInt(curr.toString()))) {
            return prev + '["' + curr + '"]';
          }
          return prev + "[" + curr + "]";
        });
      } else {
        var key = isNaN(parseInt(keyNames[0].toString())) ? '["' + keyNames[0] + '"]' : "[" + keyNames[0] + "]";
        var string = key;
      }

      break;
    default:
      return "I don't know what to do with that.";
  }


  $('#output').text(string);
  displayMsg("Copied to clipboard!");
};




// --------- on page load ---------

$(document).ready(function() {
  // Render JSON when button is clicked
  $('button').on('click', renderInput)
    // Start off by rendering out example JSON
  renderInput();
  // Copy code to user's clipboard when values are clicked
  // var clipboard = new Clipboard('.value', {
  //   text: function(trigger) {
  //     return $('#output').text();
  //   }
  // })
});