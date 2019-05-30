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

      $('.mindmap').on('click', function(ev) {
        var $mindmap = $('.mindmap');
        var mindmapWidth = $mindmap.width();
        var mindmapHeight = $mindmap.height();
        var originalEvent = ev.originalEvent;

        if (originalEvent.offsetY > 50) {
          return;
        }

        if (originalEvent.offsetX < mindmapWidth / 2) {
          minder.execCommand('zoomOut');
        } else {
          minder.execCommand('zoomIn');
        }
      });

      var toucher = touch($('.mindmap'));
      toucher.onPinchIn(function() {
        minder.execCommand('zoomOut');
      });
      toucher.onPinchOut(function() {
        minder.execCommand('zoomIn');
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

// 获取距离
function getDis(point1, point2) {
	var x = point2.x - point1.x;
	var y = point2.y - point1.y;
	return Math.sqrt(x * x + y * y);
}

function touch(container) {
  var isPinch = false;
  var isTouchMove = false;
  var startPoint = [];
  var fnPinchIn = function() {};
  var fnPinchOut = function() {};
  var timer = null;

  container.on('touchstart', function(event) {
    try {
      if (event.target) {
        var touches = event.originalEvent.touches;
        isTouchMove = false;
  
        if (touches.length >= 2) {
          isPinch = true;
          startPoint[0] = {
            x: touches[0].pageX,
            y: touches[0].pageY
          };
          startPoint[1] = {
            x: touches[1].pageX,
            y: touches[1].pageY
          };
        }
      }
    } catch(e) { }
  }).on('touchmove', function(event) {
    try {
      if(event.target) {
        var touches = event.originalEvent.touches;
        isTouchMove = true;
  
        if (isPinch && touches.length >= 2) {
          var nowPoint = [];
          nowPoint[0] = {
            x: touches[0].pageX,
            y: touches[0].pageY
          };
          nowPoint[1] = {
            x: touches[1].pageX,
            y: touches[1].pageY
          };
          
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }

          timer = setTimeout(function() {
            var startDis = getDis(startPoint[0], startPoint[1]);
            var nowDis = getDis(nowPoint[0], nowPoint[1]);

            if (nowDis > startDis) {
              fnPinchOut(nowDis / startDis, startPoint, nowPoint);
            } else {
              fnPinchIn(nowDis / startDis, startPoint, nowPoint);
            }
            startPoint = nowPoint;
          }, 1500);
        }
  
      }
    } catch(e) { }
  })
  .on('touchend', function(event) {
    try {
      if (event.target) {
        var touches = event.originalEvent.touches;
        var targetTouches = event.targetTouches;
  
        if (isPinch) {
          if (
            touches.length < 2 ||
            targetTouches.length < 1
          ) {
            isPinch = false;
          }
        }
      }
    } catch(e) { }
  });


  return {
    onPinchIn: function(callback) {
      fnPinchIn = callback;
    },
    onPinchOut: function(callback) {
      fnPinchOut = callback;
    }
  };
}
