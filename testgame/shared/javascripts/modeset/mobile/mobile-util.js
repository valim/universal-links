var MobileUtil = MobileUtil || {};

MobileUtil.isPortrait = false;
MobileUtil.isLandscape = false;

MobileUtil.PORTRAIT = 0;
MobileUtil.LANDSCAPE_RIGHT = -90;
MobileUtil.LANDSCAPE_LEFT = 90;
MobileUtil.PORTRAIT_REVERSE = 180;

MobileUtil.orientation = 0;
MobileUtil.isTracking = false;
MobileUtil.orientationCallbacks = [];

MobileUtil.watchOrientation = function(callback) {
  MobileUtil.trackOrientation();
  if (typeof callback !== 'undefined') MobileUtil.orientationCallbacks.push(callback);
};

MobileUtil.unwatchOrientation = function(callback) {
  var callbackIndex = MobileUtil.orientationCallbacks.indexOf(callback);
  if (callbackIndex != -1) MobileUtil.orientationCallbacks.splice(callbackIndex, 1);
};

MobileUtil.ADDRESS_BAR_HEIGHT = (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/Android/i)) ? 60 : 0;


MobileUtil.setContainerToWindowSize = function(element) {
  element.css({
    width: $(window).width(),
    height: $(window).height()
  });
};

MobileUtil.trackOrientation = function() {
  if (window.orientation !== undefined && !MobileUtil.isTracking) {
    MobileUtil.isTracking = true;
    window.addEventListener('orientationchange', MobileUtil.orientationUpdated, false);
    window.addEventListener('resize', MobileUtil.orientationUpdated, false);
    MobileUtil.orientationUpdated();
  }
};

MobileUtil.orientationUpdated = function() {
  // alert("DIMENSIONS: "+screen.width+"x"+screen.height+" ORIENTATION: "+window.orientation);

  if (window.orientation !== undefined) {
    MobileUtil.orientation = window.orientation;
    if( Math.abs( window.orientation ) % 180 === 90 || window.innerWidth > window.innerHeight ) {
      MobileUtil.isPortrait = false;
      MobileUtil.isLandscape = true;
    } else {
      MobileUtil.isPortrait = true;
      MobileUtil.isLandscape = false;
    }
  }
  for (var i = 0; i < MobileUtil.orientationCallbacks.length; i++) {
    MobileUtil.orientationCallbacks[i]();
  }
};

MobileUtil.lockTouchScreen = function(isLocked) {
  if (isLocked == false) {
    document.ontouchmove = null;
  } else {
    document.ontouchmove = function(event) {
      event.preventDefault();
    };
  }
};

MobileUtil.hideSoftKeyboard = function() {
  document.activeElement.blur()
  $('input').blur()
};

MobileUtil.addAndroidClasses = function() {
  // adds classes for android, android 4.0+ and not-android
  var is_android = (navigator.userAgent.toLowerCase().match(/android/i)) ? true : false;
  var elem = document.documentElement;
  if (is_android == true) {
    elem.className = [elem.className, 'is-android'].join(' ');
    // check for android 4+ so we can hardware accelerate
    var androidVersion = parseFloat(navigator.userAgent.match(/Android (\d+(?:\.\d+)+)/gi)[0].replace('Android ', ''))
    if (androidVersion >= 4) {
      elem.className = [elem.className, 'is-android4plus'].join(' ');
    }
  } else {
    elem.className = [elem.className, 'no-android'].join(' ');
  }
};

MobileUtil.openNewWindow = function(href) {
  // gets around native popup blockers
  var link = document.createElement('a');
  link.setAttribute('href', href);
  link.setAttribute('target', '_blank');
  var clickevent = document.createEvent('Event');
  clickevent.initEvent('click', true, false);
  link.dispatchEvent(clickevent);
  return false;
};

MobileUtil.isMobileBrowser = function() {
  var userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.match(/android/i)) return true;
  if (userAgent.match(/iphone/i)) return true;
  if (userAgent.match(/ipad/i)) return true;
  if (userAgent.match(/ipod/i)) return true;
  return false;
};

MobileUtil.isIOS = function() {
  var userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.match(/iphone/i)) return true;
  if (userAgent.match(/ipad/i)) return true;
  if (userAgent.match(/ipod/i)) return true;
  return false;
};

MobileUtil.isIPhone = function() {
  var userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.match(/iphone/i)) return true;
  if (userAgent.match(/ipod/i)) return true;
  return false;
};

MobileUtil.hideUrlBar = function(extraOuterElement) {
  var userAgent = navigator.userAgent.toLowerCase()
  document.body.style.height = 'auto'; // clear previous style is re-running
  if (extraOuterElement) extraOuterElement.style.height = 'auto';
  setTimeout(function() {

    if (MobileUtil.isIPhone() == true) {
      document.body.style.height = (window.innerHeight + 60) + 'px';
      if (extraOuterElement) {
        extraOuterElement.style.height = (window.innerHeight + 60) + 'px';

      }
      window.scroll(0, 1);
    }
  }, 10);
};

MobileUtil.alertErrors = function() {
  if (!window.addEventListener) return;
  window.addEventListener('error', function(e) {
    var fileComponents = e.filename.split('/');
    var file = fileComponents[fileComponents.length - 1];
    var line = e.lineno;
    var message = e.message;
    alert('ERROR\n' + 'Line ' + line + ' in ' + file + '\n' + message);
  });
};

MobileUtil.unlockWebAudioOnTouch = function() {
  window.addEventListener('touchstart', MobileUtil.playEmptyWebAudioSound, false);
};

MobileUtil.playEmptyWebAudioSound = function() {
  // originally from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
  // create empty buffer
  var myContext = new webkitAudioContext();
  var buffer = myContext.createBuffer(1, 1, 22050);
  var source = myContext.createBufferSource();
  source.buffer = buffer;
  // connect to output (your speakers)
  source.connect(myContext.destination);
  // play the file
  source.noteOn(0);
  // clean up the event listener
  window.removeEventListener('touchstart', MobileUtil.playEmptyWebAudioSound);
};
