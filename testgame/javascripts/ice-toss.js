var IceToss = function() {


  // game globals
  var _active,

  _tempIncreaseInterval,
  _thermometer,
  _slingshot,
  _cup,
  _cubes,
  _curCube,
  _perfectTemp,
  _backgrounds,
  _hidingUrlBar,
  _frameCount = 0,
    _instructionsAnim = null,
    AUTO_TEMP_TIMER = 7000,
    NUM_CUBES = 10;


  var _cssHelper = new CSSHelper();
  var _isIE = (navigator.userAgent.toLowerCase().match(/msie 9/i)) ? true : false;

  var _introScreen = $('#intro'),
    _gameScreen = $('#game'),
    _endScreen = $('#game-over'),
    _cupHolder = $('#cup-holder'),
    _temperature = $('#temperature'),
    _outer = $('#outer');

  var init = function() {

    lockMobileScreen();
    setupAudio();
    tapToStart();
    initGameOverScreen();
    buildGameObjects();
    hideUrlBar();
    // MobileUtil.alertErrors();
    //MobileUtil.addAndroidClasses();

    if (_isIE) {
      $("html").addClass('ie9');
    }
    if (!MobileUtil.isMobileBrowser() && !navigator.userAgent.toLowerCase().match(/msie 8/i)) {
      $("#instructions").css({
        'background-image': 'url(images/instructions_desktop.png)'
      });
      $(document.body).addClass('ahh-desktop');

      $("#volume_button").click(function() {
        $(this).toggleClass('mute');
        if ($(this).hasClass('mute')) {
          soundManager.mute();
        } else {
          soundManager.unmute();
        }
      });
    } else {
      $("#volume_button").hide();
      if(navigator.userAgent.toLowerCase().match(/iphone || ipod/i)){
        $("body").height($(window).height()+60);
        setTimeout(function(){
          $("html,body").scrollTop(0);
        }, 0);
      }
      else {
        $("body").height($(window).height());
      }


    }

    _instructionsAnim = new SpriteAnimation(180, 180, 1980, 540, $('#sprite')[0], null, true, _cssHelper);
    //_instructionsAnim.animateSelf(30);


    // window.ahhh.addMobileOrDesktopClass(function() {

    // });

  };

  var hideUrlBar = function() {
    var userAgent = navigator.userAgent.toLowerCase();

    if(userAgent.match(/crios/i)){
      $("body").height($(window).height());
    }
    else if(userAgent.match(/iphone/i) || userAgent.match(/ipod/i)) {
      $("body").height($(window).height()+60);
      setTimeout(function(){
        $("html,body").scrollTop(0);
      }, 0);
    }
    // $(window).resize(MobileUtil.orientationUpdated);
  };

  var _queuedTracks = [];
  var safeTrack = function(prop1, prop2, prop3) {
    if (typeof ahh !== 'undefined' && typeof ahh.util !== 'undefined') {
      // track any calls that were queued if ahh.util wasn't loaded yet
      if (_queuedTracks.length > 0) {
        for (var i = 0; i < _queuedTracks.length; i++) {
          ahh.util.track(_queuedTracks[i][0], _queuedTracks[i][1], _queuedTracks[i][2]);
        }
        _queuedTracks.splice(0);
      }
      // normal tracking call
      ahh.util.track(prop1, prop2, prop3);
    } else {
      // queue tracking call if ahh.util isn't loaded yet
      _queuedTracks.push([prop1, prop2, prop3]);

    }
  };

  var lockMobileScreen = function() {
    MobileUtil.lockTouchScreen(true);
    MouseAndTouchTracker.recurseDisableElements(_outer[0], 'img div');
    MBP.scaleFix();
    window.ahhh.initOrientationMessage();
  };

  var setupAudio = function() {
    var soundReady = function() {
      soundManager.createSound('empty', 'sounds/empty.mp3');
      soundManager.createSound('splash', 'sounds/splash.mp3');
      soundManager.createSound('lose', 'sounds/lose.mp3');
    };
    soundManager.setup({
      url: 'shared/swf/soundmanager2.swf',
      debugMode: false,
      onready: soundReady
    });
  };

  var tapToStart = function() {


    // var buttonTouch = new ButtonTouchCallback(_introScreen[0], function() {
    //   console.log("BAM")
    //   soundManager.play('empty');
    //   buttonTouch.dispose();
    //   // start game screen & hide instructions
    //   _introScreen.addClass('hidden');
    //   _gameScreen.removeClass('hidden');
    //   startGame();
    //   //_instructionsAnim.stop();

    //   if ($(document.body).hasClass('ahh-desktop')) {
    //     var bgLoop = soundManager.createSound('bg-loop', 'sounds/ice-toss-loop.mp3');
    //     loopBg(bgLoop);
    //   }
    // });
    _introScreen.click(function(){
        safeTrack('Ice Toss', 'Ice Toss', 'Tap Start');
        soundManager.play('empty');
        //buttonTouch.dispose();
        // start game screen & hide instructions
        _introScreen.addClass('hidden');
        _gameScreen.removeClass('hidden');
        startGame();
        //_instructionsAnim.stop();

        if ($(document.body).hasClass('ahh-desktop')) {
          var bgLoop = soundManager.createSound('bg-loop', 'sounds/ice-toss-loop.mp3');
          loopBg(bgLoop);
        }

    });
  };

  var initGameOverScreen = function() {
    $('#play-again-button').on('click', function(e) {
      _endScreen.addClass('hidden');
      _gameScreen.removeClass('hidden');
      startGame();

      safeTrack('Ice Toss', 'Ice Toss', 'Play Again');

    });
  };

  var buildGameObjects = function() {
    _perfectTemp = new PerfectTempIndicator();
    _backgrounds = new Backgrounds();
    _thermometer = new Thermometer();
    _cup = new Cup();
    _slingshot = new Slingshot();
    _cubes = [];

    var iceCubes = $('.ice-cube');
    var shadows = $('.ice-cube-shadow');
    _curCube = 0;
    for (var i = 0; i < NUM_CUBES; i++) {
      _cubes.push(new Cube(iceCubes[i], shadows[i]));
    }
    _cubes[_curCube].queue();
  };

  var startGame = function() {
    _active = true;
    restartTempTimer();
    _endScreen.removeClass('hot cold');

    // loop it
    window.requestAnimationFrame(render);
  };

  var loopBg = function(sound) {
    sound.play({

      volume: 60,

      onfinish: function() {
        loopBg(sound);
      }
    });
  };

  var restartTempTimer = function() {
    if (_tempIncreaseInterval) window.clearInterval(_tempIncreaseInterval);
    _tempIncreaseInterval = setInterval(function() {
      _thermometer.increaseTemp();
    }, AUTO_TEMP_TIMER);
  };

  var gameOver = function(temp) {
    if (_active == true) {
      _active = false;
      for (var i = 0; i < NUM_CUBES; i++) {
        _cubes[i].reset();
      }
      _thermometer.reset();
      window.clearInterval(_tempIncreaseInterval);

      var gameOverClass = (temp > 37) ? 'hot' : 'cold';

      _endScreen.removeClass('hidden');
      _endScreen.addClass(gameOverClass);
      _gameScreen.addClass('hidden');
      safeTrack('Ice Toss', 'Ice Toss', 'Game Complete');
    }
  };

  var render = function() {
    _frameCount++;

    _cup.update();
    _slingshot.update();
    _perfectTemp.update();
    _thermometer.updateWarningText();
    for (var i = 0; i < NUM_CUBES; i++) {
      _cubes[i].update();
    }

    if (_active == true) {
      window.requestAnimationFrame(render);
    }
  };

  // Ice Cube object ------------------------------------------------------------
  var Cube = function(iceCubeEl, shadowEl) {
    var _iceCubeHolder = $('#in-front-of-cup');
    var _shadowHolder = $('#behind-cup');
    var _iceCube = $(iceCubeEl);
    var _shadow = $(shadowEl);

    var _scoreY = _iceCubeHolder.offset().top - (_cupHolder.offset().top + 20);
    var _shadowTravel = _iceCubeHolder.offset().top - (_cupHolder.offset().top + 20) - $('#cup').height();

    var _iceCubeX = 0;
    var _iceCubeY = 0;
    var _iceCubeZ = 0;
    var _iceCubeRot = 0;
    var _iceCubeScale = 1;
    var _speedX = 0;
    var _speedY = 0;
    var _speedZ = 0;
    var _speedRot = 0;
    var _released = false;
    var _dragging = false;
    var _queued = false;
    var _pastCup = false;
    var _pastRoomCorner = false;

    var updateIceCubeCss = function() {
      _cssHelper.update2DPosition(_iceCube[0], _iceCubeX, _iceCubeY, _iceCubeScale, _iceCubeRot);
      _cssHelper.update2DPosition(_shadow[0], _iceCubeX, _iceCubeZ, _iceCubeScale, 0);
    };

    var reset = function() {
      _released = false;
      _iceCubeX = 0;
      _iceCubeY = 0;
      _iceCubeZ = 0;
      _speedX = 0;
      _speedY = 0;
      _speedZ = 0;
      _iceCubeRot = 0;
      _iceCubeScale = 0;

      if (_isIE) {

        _iceCubeScale = .01;
      }
      _pastRoomCorner = false;
      if (_pastCup == true) {
        _iceCubeHolder.append(_iceCube);
      }
      _pastCup = false;
      _shadow.addClass('hidden');
      updateIceCubeCss();
    };

    var update = function() {
      if (_released == true) {
        _iceCubeX += _speedX;
        _iceCubeY += _speedY;
        _iceCubeZ += _speedZ;
        _speedY += 0.5;
        _iceCubeRot += _speedRot;
        _iceCubeScale -= 0.007;
        // check cube in cup
        if (_speedY > 3) {
          if (Math.abs(_iceCubeX - _cup.cupX()) < 45) { // check x
            if (_iceCubeY < -_scoreY + 10 && _iceCubeY > -_scoreY - 10) { // check y
              var zDist = _shadowTravel + _iceCubeZ;
              // console.log('zDist',zDist);
              if (zDist > -60 && zDist < 5) { // check z
                reset();
                iceCubeWin();
              }
            }
          }
        }
        // detect off-screen
        if (_iceCubeY > window.innerHeight || _iceCubeX > window.innerWidth * 0.5 || _iceCubeX < -window.innerWidth * 0.5) {
          reset();
          iceCubeLose();
        }
        // detect hitting ground (check _shadow against _iceCube Y)
        if (_speedY > 0 && Math.abs(_iceCubeY - _iceCubeZ) < 30) {
          reset();
          iceCubeLose();
        }
        // swap containers for z-index update if cube moves beyond cup
        if (_iceCubeZ < -_shadowTravel && _pastCup == false) {
          _shadowHolder.append(_iceCube);
          _pastCup = true;
        }
        // kill shadow if it moves beyond room corner
        if (_iceCubeZ < -_shadowTravel - 96 && _pastRoomCorner == false) {
          _shadow.addClass('hidden');
          _pastRoomCorner = true;
        }
        // always update css as it moves
        updateIceCubeCss();
      } else if (_dragging == true || _queued == true) {
        if (_iceCubeScale < 1) {
          _iceCubeScale += 0.05;
        }
        updateIceCubeCss();
      }
    };

    var startDragging = function(x, y) {
      _dragging = true;
      _queued = false;
      _shadow.addClass('hidden');
      var oldScale = _iceCubeScale;
      reset();
      _iceCubeScale = oldScale;
    };

    var release = function(x, y, z, xSpeed, ySpeed, zSpeed) {
      _iceCubeX = x;
      _iceCubeY = y;
      _iceCubeZ = z;
      _speedX = xSpeed;
      _speedY = ySpeed;
      _speedZ = zSpeed;
      _iceCubeScale = 1;
      _speedRot = Math.random() * 10 - 5;
      _dragging = false;
      _released = true;
      _shadow.removeClass('hidden');
      safeTrack('Ice Toss', 'Ice Toss', 'Toss');
    };

    var updateDragging = function(x, y) {
      _iceCubeX = x;
      _iceCubeY = y;
      updateIceCubeCss();
    };

    var iceCubeWin = function() {
      soundManager.play('splash');
      _thermometer.decreaseTemp();
      restartTempTimer();
      _cup.splash();
    };

    var iceCubeLose = function() {
      // soundManager.play('lose');
    };

    var queue = function() {
      _queued = true;
    };

    reset();

    return {
      reset: reset,
      update: update,
      release: release,
      queue: queue,
      startDragging: startDragging,
      updateDragging: updateDragging
    };
  };

  // Slingshot object ------------------------------------------------------------
  var Slingshot = function() {

    var slingshot = $('#slingshot');

    var elasticLeft = $('#elastic-left');
    var elasticRight = $('#elastic-right');
    var cradle = $('#cradle');

    var point = new ElasticPoint(0, 0, 0, 0.9, 0.2);

    var elasticAnchorX = 84;
    var elasticCradleX = 28;
    var elasticCradleY = 17;


    if (_isIE) {
      var paper = new Raphael($('#arms')[0], $('#arms').width(), $("#arms").height());
      var r_elasticLeft = paper.image('images/elastic.jpg', 0, 0, 100, 5);
      var r_elasticRight = paper.image('images/elastic.jpg', 0, 0, 100, 5);

      r_elasticLeft.attr({
        'x': -(elasticAnchorX - 120),
        'y': elasticCradleY + 35
      });
      r_elasticRight.attr({
        'x': 155,
        'y': 50
      });

    }

    var _touchTracker = new MouseAndTouchTracker(slingshot[0], function(touchState) {
      switch (touchState) {
        case MouseAndTouchTracker.state_start:

          _cubes[_curCube].startDragging();
          point.setTarget(0, 0, 0);
          if (_hidingUrlBar == true) window.scroll(0, 1);
          slingshot.addClass('active');
          break;
        case MouseAndTouchTracker.state_move:
          point.setTarget(_touchTracker.touchmoved.x, _touchTracker.touchmoved.y, 0);
          break;
        case MouseAndTouchTracker.state_end:
          if (slingshot.hasClass('active')) {
            point.setTarget(0, 0, 0);
            _cubes[_curCube].release(
            point.x(),
            point.y(),
            0,
            _touchTracker.touchmoved.x / -3,
            _touchTracker.touchmoved.y / -3,
            _touchTracker.touchmoved.y / -63);
            // queue up next cube
            slingshot.removeClass('active');
            _curCube++;
            if (_curCube >= NUM_CUBES) _curCube = 0;
            _cubes[_curCube].queue();
          }
          break;
        case MouseAndTouchTracker.state_enter:
          break;
        case MouseAndTouchTracker.state_leave:
          break;
      }
    }, false, 'div');

    var update = function() {
      var dist, angle;

      // update elastic slingshot and graphics
      point.update();

      // update elastic slingshot

      dist = MathUtil.getDistance(-elasticAnchorX, 0, point.x() - elasticCradleX, point.y());
      angle = MathUtil.getAngleToTarget(-elasticAnchorX, 0, point.x() - elasticCradleX, point.y());

      if (!_isIE) elasticLeft.css({
        'width': CSSHelper.roundForCSS(dist)
      });
      _cssHelper.update2DPosition(elasticLeft[0], -elasticAnchorX, elasticCradleY, 1, (angle - 90));
      if (_isIE) {
        r_elasticLeft.animate({
          transform: ["R", (angle - 90).toFixed(), -(elasticAnchorX - 120), elasticCradleY + 35]
        });
        if (!navigator.userAgent.toLowerCase().match(/msie 8/i)) {
          r_elasticLeft.attr({
            'width': dist
          });
        }
      }

      dist = MathUtil.getDistance(elasticAnchorX, 0, point.x() + elasticCradleX, point.y());
      angle = MathUtil.getAngleToTarget(elasticAnchorX, 0, point.x() + elasticCradleX, point.y());

      if (!_isIE) elasticRight.css({
        'width': CSSHelper.roundForCSS(dist)
      });
      _cssHelper.update2DPosition(elasticRight[0], elasticAnchorX, elasticCradleY, 1, (angle - 90));
      if (_isIE) {
        r_elasticRight.animate({
          transform: ["R", (angle + 90).toFixed(), CSSHelper.roundForCSS(dist) + 145, dist]
        });
        if (!navigator.userAgent.toLowerCase().match(/msie 8/i)) {
          r_elasticRight.attr({
            'width': dist
          });
        }

      }


      _cssHelper.update2DPosition(cradle[0], point.x(), point.y(), 1, 0);

      // update _iceCube if in cradle
      if (_touchTracker.is_touching == true) {
        _cubes[_curCube].updateDragging(point.x(), point.y());
      }
    };

    return {
      update: update
    }
  };

  // Cup object ------------------------------------------------------------
  var Cup = function() {
    var _cup = $('#cup-mover');
    var _cupStraw = $('#cup-straw');
    var _cupImage = $('#cup');
    var _cupW = _cupImage.width()
    var _incCup = 0;
    var _cupX = 0;
    var _cupXLast = 0;
    var _cupTravel = _outer.width() / 3;
    var _cupStrawX = 0;
    var _cupStrawTravel = 27;
    var _cupStrawOffset = _cupImage.width() / 2 - 4;
    // var _cupFollow = new ElasticPoint( _cupX, 0, 0, 0.2, 0.2 );

    var _splashAnim = new SpriteAnimation(75, 46.5, 525, 93, $('#cup-splash-sprite')[0], null, false, _cssHelper);

    var update = function() {
      _incCup += 0.02;
      _cupXLast = _cupX;
      _cupX = Math.round(Math.sin(_incCup) * _cupTravel);
      var curX = _cupX - (_cupW / 2);
      _cssHelper.update2DPosition(_cup[0], curX, 0, 1, 0);

      _cupStrawX += (_cupXLast - _cupX) / 2;
      if (_cupStrawX > _cupStrawTravel) _cupStrawX = _cupStrawTravel;
      if (_cupStrawX < -_cupStrawTravel) _cupStrawX = -_cupStrawTravel;
      _cssHelper.update2DPosition(_cupStraw[0], _cupStrawX + _cupStrawOffset, 0, 1, _cupStrawX / 3);
    };

    var splash = function() {
      _splashAnim.animateSelf(50);
    };

    return {
      update: update,
      splash: splash,
      cupX: function() {
        return _cupX;
      }
    }
  };

  // Thermometer object ------------------------------------------------------------
  var Thermometer = function() {
    var _temp = 37;
    var _baseTemp = _temp;
    var _meter = $('#meter');
    var _degrees = $('#degrees');
    var _showingFlashText = false;
    var _tempOffset = 0;
    var _warningOffsetThresh = 8;

    var reset = function() {
      _temp = 37;
      _tempOffset = 0;
      updateDisplay();
      _temperature.removeClass('too-cold too-hot');
    };

    var increaseTemp = function() {
      _temp++;
      updateDisplay();
    };

    var decreaseTemp = function() {
      _temp--;
      updateDisplay();
    };

    var updateDisplay = function() {
      _tempOffset = _temp - _baseTemp;

      // te ext and bar height
      _degrees.html(_temp + "&deg;");
      var percent = 50 + (_temp - _baseTemp) * 5;
      _meter.css({
        height: percent + '%'
      });

      // check for game over
      if (_temp > 47 || _temp < 27) {
        gameOver(_temp);
      }

      // update perect temp
      if (_temp == 37) {
        _perfectTemp.show();
      } else {
        _perfectTemp.hide();
      }

      // update backgrounds
      _backgrounds.updateWithTempOffset(_tempOffset);
    };

    var updateWarningText = function() {
      // update too hot/cold temp flashy text
      if (_tempOffset >= _warningOffsetThresh) {
        if (_frameCount % 15 == 0) {
          _showingFlashText = !_showingFlashText;
          (_showingFlashText == true) ? _temperature.addClass('too-hot') : _temperature.removeClass('too-hot');
        }
      } else if (_tempOffset <= -_warningOffsetThresh) {
        if (_frameCount % 15 == 0) {
          _showingFlashText = !_showingFlashText;
          (_showingFlashText == true) ? _temperature.addClass('too-cold') : _temperature.removeClass('too-cold');
        }
      } else {
        if (_showingFlashText == true) {
          _showingFlashText = false;
          _temperature.removeClass('too-cold too-hot');
        }
      }

    };

    updateDisplay();

    return {
      updateDisplay: updateDisplay,
      increaseTemp: increaseTemp,
      decreaseTemp: decreaseTemp,
      updateWarningText: updateWarningText,
      reset: reset
    };
  };

  // Perfect temp display object ------------------------------------------------------------
  var PerfectTempIndicator = function() {
    var _perfect = $('#perfect-temp');
    var _active = true;
    var _showing = true;

    var update = function() {
      if (_active) {
        if (_frameCount % 20 == 0) {
          _showing = !_showing;
          (_showing == true) ? _perfect.removeClass('hide') : _perfect.addClass('hide');
        }
      }
    };

    var show = function() {
      _active = true;
    };

    var hide = function() {
      _active = false;
      _perfect.addClass('hide');
    };

    return {
      update: update,
      show: show,
      hide: hide
    };
  };

  // Backgrounds object ------------------------------------------------------------
  var Backgrounds = function() {
    var _hot = $('#background-hot');
    var _cupSweat = $('#cup-sweat');
    var _puddle = $('#cup-puddle');
    var _cold = $('#background-cold');
    var _icicles = $('#background-icicles');
    var _iceHiddenY = -190;

    var updateWithTempOffset = function(offset) {
      offset *= 0.1;
      if (offset == 0) {
        setOpacity(_hot, 0);
        setOpacity(_cupSweat, 0);
        setOpacity(_puddle, 0);
        setOpacity(_cold, 0);
        _icicles.css('top', _iceHiddenY);
      } else if (offset < 0) {
        setOpacity(_cold, Math.abs(offset));
        _icicles.css('top', _iceHiddenY + _iceHiddenY * offset);
      } else if (offset > 0) {
        setOpacity(_hot, Math.abs(offset));
        setOpacity(_cupSweat, Math.abs(offset));
        setOpacity(_puddle, 1);

        if (navigator.userAgent.toLowerCase().match(/msie 9/i)) {
          _cssHelper.update2DPosition(_puddle[0], 20, 0, 0.5 + Math.abs(offset) * 0.5, 0);
        } else if (navigator.userAgent.toLowerCase().match(/msie 8/i)) {
          _cssHelper.update2DPosition(_puddle[0], 0, 130 - (Math.abs(offset) * 130), 0.5 + Math.abs(offset) * 0.5, 0);
        } else {
          _cssHelper.update2DPosition(_puddle[0], 0, 0, 0.5 + Math.abs(offset) * 0.5, 0);

        }
      }
    };

    var setOpacity = function(jEl, opacity) {
      jEl.css('opacity', opacity);
    };

    return {
      updateWithTempOffset: updateWithTempOffset
    };
  };

  // Kick it off ----------------------------------------------------------------
  init();

};
window.iceToss = new IceToss();
