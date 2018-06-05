(function() {
  // Shared share obj --------------------------------------------
  var shareObj = {
    method: 'feed',
    link: 'http://ahhhhhhhhhh.com',
    picture: 'http://www.ahhhhhhhhhh.com/shared/images/IceToss.jpg',
    name: 'AHH - Ice Toss',
    caption: 'AHHHHHHHHHH.com',
    description: "I just played Ice Toss, the game that makes refrigerators useless and Coke three times as fun.",
    twitterDescription: "I just played Ice Toss, the game that makes refrigerators useless and Coke three times as fun. #AHH"

  };

  // FB setup ---------------------------------------------
  // $(document.body).append('<div id="fb-root"></div>');

  FB.init({
    appId: "233874886751185",
    status: true,
    cookie: true
  });

  function postToFeed() {
    ahh.util.track('Ice Toss', 'Ice Toss', 'FB Share');

    function callback(response) {}
    FB.ui(shareObj, callback);
  }


  $('#facebook-button').on('click', function(e) {
    e.preventDefault();
    postToFeed();
  });

  // Twitter setup ----------------------------------------

  $('#twitter-button').on('click', function(e) {
    e.preventDefault();
    ahh.util.track('Ice Toss', 'Ice Toss', 'Twitter Share');
    var windowProperties = "toolbar=no,menubar=no,scrollbars=no,statusbar=no,height=" + 500 + ",width=" + 500 + ",left=" + 150 + ",top=" + 150;
    var popwin = window.open("http://twitter.com/share?url=" + encodeURIComponent(shareObj.link) + "&text=" + encodeURIComponent(shareObj.twitterDescription), 'newwin', windowProperties);
    popwin.focus();
  });

})();

