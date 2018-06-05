/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

Vector2 = function ( x, y ) {

  this.x = x || 0;
  this.y = y || 0;

};

Vector2.prototype = {

  constructor: Vector2,

  set: function ( x, y ) {

    this.x = x;
    this.y = y;

    return this;

  },

  setX: function ( x ) {

    this.x = x;

    return this;

  },

  setY: function ( y ) {

    this.y = y;

    return this;

  },


    setComponent: function ( index, value ) {

        switch( index ) {

            case 0: this.x = value; break;
            case 1: this.y = value; break;
            default: throw new Error( "index is out of range: " + index );

        }

    },

    getComponent: function ( index ) {

        switch( index ) {

            case 0: return this.x;
            case 1: return this.y;
            default: throw new Error( "index is out of range: " + index );

      }
    },

  copy: function ( v ) {

    this.x = v.x;
    this.y = v.y;

    return this;

  },

  addScalar: function ( s ) {

    this.x += s;
    this.y += s;

    return this;

  },

  add: function ( a, b ) {

    this.x = a.x + b.x;
    this.y = a.y + b.y;

    return this;

  },

  addSelf: function ( v ) {

    this.x += v.x;
    this.y += v.y;

    return this;

  },

  sub: function ( a, b ) {

    this.x = a.x - b.x;
    this.y = a.y - b.y;

    return this;

  },

  subSelf: function ( v ) {

    this.x -= v.x;
    this.y -= v.y;

    return this;

  },

  multiplyScalar: function ( s ) {

    this.x *= s;
    this.y *= s;

    return this;

  },

  divideScalar: function ( s ) {

    if ( s !== 0 ) {

      this.x /= s;
      this.y /= s;

    } else {

      this.set( 0, 0 );

    }

    return this;

  },

  minSelf: function ( v ) {

    if ( this.x > v.x ) {

      this.x = v.x;

    }

    if ( this.y > v.y ) {

      this.y = v.y;

    }

    return this;

  },

  maxSelf: function ( v ) {

    if ( this.x < v.x ) {

      this.x = v.x;

    }

    if ( this.y < v.y ) {

      this.y = v.y;

    }

    return this;

  },

  clampSelf: function ( min, max ) {

    // This function assumes min < max, if this assumption isn't true it will not operate correctly

    if ( this.x < min.x ) {

      this.x = min.x;

    } else if ( this.x > max.x ) {

      this.x = max.x;

    }

    if ( this.y < min.y ) {

      this.y = min.y;

    } else if ( this.y > max.y ) {

      this.y = max.y;

    }

    return this;

  },

  negate: function() {

    return this.multiplyScalar( - 1 );

  },

  dot: function ( v ) {

    return this.x * v.x + this.y * v.y;

  },

  lengthSq: function () {

    return this.x * this.x + this.y * this.y;

  },

  length: function () {

    return Math.sqrt( this.x * this.x + this.y * this.y );

  },

  normalize: function () {

    return this.divideScalar( this.length() );

  },

  distanceTo: function ( v ) {

    return Math.sqrt( this.distanceToSquared( v ) );

  },

  distanceToSquared: function ( v ) {

    var dx = this.x - v.x, dy = this.y - v.y;
    return dx * dx + dy * dy;

  },

  setLength: function ( l ) {

    var oldLength = this.length();
    
    if ( oldLength !== 0 && l !== oldLength  ) {

      this.multiplyScalar( l / oldLength );
    }

    return this;

  },

  lerpSelf: function ( v, alpha ) {

    this.x += ( v.x - this.x ) * alpha;
    this.y += ( v.y - this.y ) * alpha;

    return this;

  },

  equals: function( v ) {

    return ( ( v.x === this.x ) && ( v.y === this.y ) );

  },

  clone: function () {

    return new Vector2( this.x, this.y );

  }

};

/*
/* 2D Vector
*/
var Vector;

Vector = (function() {
  /* Adds two vectors and returns the product.
  */
  Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  };

  /* Subtracts v2 from v1 and returns the product.
  */

  Vector.sub = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  };

  /* Projects one vector (v1) onto another (v2)
  */

  Vector.project = function(v1, v2) {
    return v1.clone().scale((v1.dot(v2)) / v1.magSq());
  };

  /* Creates a new Vector instance.
  */

  function Vector(x, y) {
    this.x = x != null ? x : 0.0;
    this.y = y != null ? y : 0.0;
  }

  /* Sets the components of this vector.
  */

  Vector.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  /* Add a vector to this one.
  */

  Vector.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  };

  /* Subtracts a vector from this one.
  */

  Vector.prototype.sub = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  };

  /* Scales this vector by a value.
  */

  Vector.prototype.scale = function(f) {
    this.x *= f;
    this.y *= f;
    return this;
  };

  /* Computes the dot product between vectors.
  */

  Vector.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
  };

  /* Computes the cross product between vectors.
  */

  Vector.prototype.cross = function(v) {
    return (this.x * v.y) - (this.y * v.x);
  };

  /* Computes the magnitude (length).
  */

  Vector.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  /* Computes the squared magnitude (length).
  */

  Vector.prototype.magSq = function() {
    return this.x * this.x + this.y * this.y;
  };

  /* Computes the distance to another vector.
  */

  Vector.prototype.dist = function(v) {
    var dx, dy;
    dx = v.x - this.x;
    dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  /* Computes the squared distance to another vector.
  */

  Vector.prototype.distSq = function(v) {
    var dx, dy;
    dx = v.x - this.x;
    dy = v.y - this.y;
    return dx * dx + dy * dy;
  };

  /* Normalises the vector, making it a unit vector (of length 1).
  */

  Vector.prototype.norm = function() {
    var m;
    m = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x /= m;
    this.y /= m;
    return this;
  };

  /* Limits the vector length to a given amount.
  */

  Vector.prototype.limit = function(l) {
    var m, mSq;
    mSq = this.x * this.x + this.y * this.y;
    if (mSq > l * l) {
      m = Math.sqrt(mSq);
      this.x /= m;
      this.y /= m;
      this.x *= l;
      this.y *= l;
      return this;
    }
  };

  /* Copies components from another vector.
  */

  Vector.prototype.copy = function(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  };

  /* Clones this vector to a new itentical one.
  */

  Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
  };

  /* Resets the vector to zero.
  */

  Vector.prototype.clear = function() {
    this.x = 0.0;
    this.y = 0.0;
    return this;
  };

  return Vector;

})();

*/