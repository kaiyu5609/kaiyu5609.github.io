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


  // 通知 20190528 在node_modules/hexo-blog-encrypt/lib/blog-encrypt中添加
  // var evt = document.createEvent('HTMLEvents');
  // evt.initEvent('pass', true, true);
  // document.dispatchEvent(evt);

  // 百度思维导图 20190528
  function renderMinder() {
      var minder = new kityminder.Minder({
          renderTo: '.mindmap',
      });

      var markdownText = $('.mindmap').text().trim();

      if (!markdownText) {
        return;
      }
      
      $('.mindmap p').each(function(index, element) {
        element.style.display = 'none';
      });

      minder.decodeData('markdown', markdownText).then(function(json) {
        json.template = 'right';
        minder.importJson(json);
      });

      minder.execCommand('hand');
      
      // minder.disable();
      // minder.execCommand('hand');
      // minder.execCommand('template', 'right');
      // console.log(kityminder.Minder.getTemplateList())
      // console.log(minder.queryCommandValue('template'))
      // console.log(minder)

      var mindmap = document.querySelector('.mindmap');
      var hammertime = new Hammer(mindmap);

      hammertime.on('tap', function(ev) {
        var $mindmap = $('.mindmap');
        var mindmapWidth = $mindmap.width();
        var mindmapHeight = $mindmap.height();
        var srcEvent = ev.srcEvent;

        if (srcEvent.offsetY > 50) {
          return;
        }

        if (srcEvent.offsetX < mindmapWidth / 2) {
          minder.execCommand('zoomOut');
        } else {
          minder.execCommand('zoomIn');
        }
      });


  }


  document.addEventListener('pass', function(event) {
    setTimeout(function() {
      renderMinder();
    },100);
  }, false);

  setTimeout(function() {
    if ($('.mindmap').size()) {
      renderMinder();
    }
  },100);


});
