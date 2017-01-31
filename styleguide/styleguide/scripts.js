/* ========================================================================

 * Document Ready
 * ======================================================================== */

// $( document ).ready() block.
$( document ).ready(function() {



  /**
   * Initialize highlight js
   * @param  {i}
   * @param  {block}
   * @return {el}
   */
  $('pre code').each(function(i, block) {
    hljs.configure({
      tabReplace: '  ', // 2 spaces
      classPrefix: 'sg-code--'// prefix classes
    })
    hljs.highlightBlock(block);
  });




  /**
   * Copy code blocks to clipboard
   * @type {String}
   */
  ZeroClipboard.config( { swfPath: "lib/js/styleguide/ZeroClipboard.swf" } );

  var $client = new ZeroClipboard( $( 'code, .js-copy-next, .sg-color__btn, .js-svg-clipboard' ) );

  $client.on( 'ready', function(event) {
    $client.on( 'copy', function(event) {
      if($(event.target).hasClass("js-copy-next"))
      {
        event.clipboardData.setData('text/plain', $(event.target).next().text());
      }
      else if($(event.target).hasClass("js-svg-clipboard"))
      {
        event.clipboardData.setData('text/plain', $(event.target).html());
      } else {
        event.clipboardData.setData('text/plain', $(event.target).text().replace(/\./g, ''));
      }
    });
    $client.on( 'aftercopy', function(event) {
      console.log('Copied text to clipboard: ' + event.data['text/plain']);
    });
  });

  $client.on( 'error', function(event) {
    console.log( 'ZeroClipboard error of type "' + event.name + '": ' + event.message );
    ZeroClipboard.destroy();
  });




  /**
   * Click event to toggle documentation
   * @type {function}
   */
  var $toglDocs = $('.js-doc-toggle');
  $toglDocs.click(function() {
    $(this).next().toggleClass('is-toggled-documentation');
  });




});