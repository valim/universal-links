window.ahhh = {};

window.ahhh.initOrientationMessage = function() {

  if (MobileUtil.isMobileBrowser()) {
    $(document.body).append('<div id="landscape-message"><div></div></div>');
    var landscapeMessage = $('#landscape-message');

    var orientationChanged = function() {
      if (MobileUtil.isLandscape && !navigator.userAgent.toLowerCase().match(/asus/i)) {
        landscapeMessage.addClass('showing');

        $("body").height($(window).height());
        if (typeof ahh !== 'undefined') ahh.embed.showPageNav(false);
        setTimeout(function() {
          if (document.body.style.height != '')
            landscapeMessage.css('height', document.body.style.height);
        }, 100);

      } else {
        if (navigator.userAgent.toLowerCase().match(/crios/i)) {
          $("body").height($(window).height());
          window.scrollTo(0, 1);
        } else {
          $("body").height($(window).height() + 60);
          setTimeout(function() {
            $("html,body").scrollTop(0);
          }, 0);
        }


        landscapeMessage.removeClass('showing');

        if (typeof ahh !== 'undefined') ahh.embed.showPageNav(true);

      }
    };

    MouseAndTouchTracker.recurseDisableElements(landscapeMessage[0], 'div');
    MobileUtil.watchOrientation(orientationChanged);
    orientationChanged();
  }

  // Call for device support
  ahhh.device_support();
};

window.ahhh.device_support = function() {

  var userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.match(/android 4.0/i) && !userAgent.match(/chrome/i) || userAgent.match(/msie 7.0/i) || userAgent.match(/kindle/i) || userAgent.match(/silk/i) || userAgent.match(/android 2/i) || userAgent.match(/nook/i) || userAgent.match(/kindle/i)) {
    $("#outer").html("<div id='unsupported'><img src='shared/images/unsupported.png' style='margin-top:120px'></div>");
  }


};

