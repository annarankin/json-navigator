$(function() {

  $divs = $('.results').find('div').slice(1, -1);

  var currentLine = 0;

  window.setTimeout(function() {

    $divs.each(function(idx, el){ 
      var idName = $(el).data('id')
      var pTagsUntilNextDiv = $(el).children().eq(0).nextUntil('div').length + 1 ;
      var totalLines = $(el).find('p').length;
      // Find out when you should start giving classes to line nums
      // skip pTags until next div, apply idName as classname to lis up to total lines
      var $currentLi = $('.line-numbers li').eq(currentLine);
      console.log(idName, 'currentline:', currentLine, 'total:',totalLines, 'til div:', pTagsUntilNextDiv);
      console.log($currentLi[0]);
      // $currentLi.addClass(idName);

      // apply classname  to all Li's up to totalLines limit
      for (var i = 0; i < totalLines; i++) {
        
        $currentLi = $currentLi.next()
        $currentLi.addClass(idName);
      };

      currentLine += pTagsUntilNextDiv;
      console.log(currentLine)
    });
  }, 1000);
})