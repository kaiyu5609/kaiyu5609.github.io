$(document).ready(function () {
  var $headerInner = $('.header-inner');
  var $sidebar = $('#sidebar');
  var getSidebarTop = function(){
    return $headerInner.height() + CONFIG.sidebar.offset;
  };
  var setSidebarMarginTop = function(sidebarTop){
    return $sidebar.css({ 'margin-top': sidebarTop });
  };
  var mql = window.matchMedia('(min-width: 991px)');
  setSidebarMarginTop(getSidebarTop()).show();
  mql.addListener(function(e){
    if(e.matches){
      setSidebarMarginTop(getSidebarTop());
    }
  });

  // 百度思维导图 20190528
  setTimeout(function() {
      var minder = new kityminder.Minder({
          renderTo: '.mindmap',
      });

      var markdownText = $('.mindmap').text().trim();
      $('.mindmap p').each(function(index, element) {
        element.style.display = 'none';
      });

      minder.decodeData('markdown', markdownText).then(function(json) {
        json.template = 'right';
        minder.importJson(json);
      });
      
      // minder.disable();
      // minder.execCommand('hand');
      // minder.execCommand('template', 'right');
      // console.log(kityminder.Minder.getTemplateList())
      // console.log(minder.queryCommandValue('template'))
      // console.log(minder)
  }, 500);


});
