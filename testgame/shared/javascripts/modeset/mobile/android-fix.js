!function(){
  var is_android2 = ( navigator.userAgent.toLowerCase().match(/android 2/i) ) ? true : false;
  if( is_android2 == true ) {
    var elem = document.documentElement;
    elem.className = [elem.className, 'android2x'].join(' ');
  }
}();