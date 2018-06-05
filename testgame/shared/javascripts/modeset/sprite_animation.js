var SpriteAnimation = function( frameW, frameH, spriteW, spriteH, imageEl, numFrames, loops, cssHelper ) {

  var _width = frameW;
  var _height = frameH;
  var _rows = (spriteH / _height);
  var _cols = (spriteW / _width);
  var _max_frame = _rows * _cols;
  var _num_frames = numFrames || _max_frame;
  var _cur_frame = 0;
  var _loops = loops || false;
  var _x = 0;
  var _y = 0;
  var _img_sprite = imageEl;
  var _frameRate = 0;
  var _timeout = null;
  var _active = true;

  var update = function(){
    _x = _cur_frame % _cols;
    _y = Math.floor(_cur_frame / _cols);

    if( !cssHelper ) {
      _img_sprite.style.left = -_x * _width + 'px';
      _img_sprite.style.top = -_y * _height + 'px';
    } else {
      cssHelper.update2DPosition( _img_sprite, -_x * _width, -_y * _height, 1, 0);
    }

    _cur_frame++;
    if( _cur_frame == _num_frames ) {
      if( _loops == true ) {
        _cur_frame = 0;
      } else {
        _frameRate = 0;
      }
    } 

    if( _frameRate != 0 ) {
      _timeout = setTimeout( function(){ update(); }, _frameRate );
    }
  };

  var animateSelf = function( frameRate ) {
    stop();
    _frameRate = frameRate;
    _cur_frame = 0;
    update();
  };

  var stop = function() {
    if( _timeout != null ) {
      clearTimeout( _timeout );
      _timeout = null;
      _frameRate = 0;
    }
  };

  return {
    update: update,
    animateSelf: animateSelf,
    stop: stop
  };
};