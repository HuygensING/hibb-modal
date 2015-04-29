!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.Pagination=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

},{}],2:[function(_dereq_,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || _dereq_('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(_dereq_,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":1}],3:[function(_dereq_,module,exports){
var $, Backbone, Modal, modalManager, tpl, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Backbone = _dereq_('backbone');

_ = _dereq_('underscore');

$ = _dereq_('jquery');

tpl = _dereq_('./main.jade');

modalManager = _dereq_('./manager');


/*
 * @class
 * @uses ModalManager
 */

Modal = (function(_super) {
  __extends(Modal, _super);

  function Modal() {
    return Modal.__super__.constructor.apply(this, arguments);
  }


  /*
  	 * @property
  	 * @type {String}
   */

  Modal.prototype.className = "hibb-modal";


  /*
  	 * @method
  	 * @return {Object} Default options.
   */

  Modal.prototype.defaultOptions = function() {
    return {
      title: '',
      titleClass: '',
      cancelAndSubmit: true,
      cancelValue: 'Cancel',
      submitValue: 'Submit',
      customClassName: '',
      focusOnFirstInput: true,
      clickOverlay: true
    };
  };


  /*
  	 * @method
  	 * @construct
  	 * @param {Object} [this.options]
  	 * @param {String} [this.options.title=''] Title of the modal.
  	 * @param {String} [this.options.titleClass=''] Deprecated by customClassName?
  	 * @param {String} [this.options.width] Width of the modal in px, %, vw or auto. 
  	 * @param {String} [this.options.height] Height of the modal in px, %, vw or auto.
  	 * @param {String} [this.options.html]
  	 * @param {Boolean} [this.options.cancelAndSubmit=true] Show cancel and submit button.
  	 * @param {String} [this.options.cancelValue='Cancel'] Value for the cancel button.
  	 * @param {String} [this.options.submitValue='Submit'] Value for the submit button.
  	 * @param {String} [this.options.customClassName=''] Add a className to top level to support styling and DOM manipulation. 
  	 * @param {Boolean} [this.options.focusOnFirstInput=true] Set the focus to the first <input> when the modal is shown.
  	 * @param {Boolean} [this.options.clickOverlay=true] If the overlay is clicked, cancel is triggered. Defaults to true.
   */

  Modal.prototype.initialize = function(_at_options) {
    this.options = _at_options != null ? _at_options : {};
    Modal.__super__.initialize.apply(this, arguments);
    this.options = _.extend(this.defaultOptions(), this.options);
    if (this.options.customClassName.length > 0) {
      this.$el.addClass(this.options.customClassName);
    }
    return this.render();
  };


  /*
  	 * @method
   */

  Modal.prototype.render = function() {
    var body, bodyTop, firstInput, marginLeft, offsetTop, rtpl, viewportHeight;
    rtpl = tpl(this.options);
    this.$el.html(rtpl);
    body = this.$('.body');
    if (this.options.html != null) {
      body.html(this.options.html);
    } else {
      body.hide();
    }
    this.$('.body').scroll((function(_this) {
      return function(ev) {
        return ev.stopPropagation();
      };
    })(this));
    modalManager.add(this);
    if (this.options.width != null) {
      this.$('.modalbody').css('width', this.options.width);
      marginLeft = -1 * parseInt(this.options.width, 10) / 2;
      if (this.options.width.slice(-1) === '%') {
        marginLeft += '%';
      }
      if (this.options.width.slice(-2) === 'vw') {
        marginLeft += 'vw';
      }
      if (this.options.width === 'auto') {
        marginLeft = this.$('.modalbody').width() / -2;
      }
      this.$('.modalbody').css('margin-left', marginLeft);
    }
    if (this.options.height != null) {
      this.$('.modalbody').css('height', this.options.height);
    }
    viewportHeight = document.documentElement.clientHeight;
    offsetTop = this.$('.modalbody').outerHeight() / 2;
    bodyTop = this.$('.modalbody').offset().top;
    if (offsetTop > bodyTop) {
      offsetTop = bodyTop - 20;
    }
    this.$('.modalbody').css('margin-top', -1 * offsetTop);
    this.$('.modalbody .body').css('max-height', viewportHeight - 175);
    if (this.options.focusOnFirstInput) {
      firstInput = this.$('input[type="text"]').first();
      if (firstInput.length > 0) {
        firstInput.focus();
      }
    }
    return this;
  };


  /*
  	 * @method
  	 * @return {Object}
   */

  Modal.prototype.events = function() {
    return {
      "click button.submit": '_submit',
      "click button.cancel": "_cancel",
      "click .overlay": function() {
        if (this.options.clickOverlay) {
          return this._cancel();
        }
      },
      "keydown input": function(ev) {
        if (ev.keyCode === 13) {
          ev.preventDefault();
          return this._submit(ev);
        }
      }
    };
  };


  /*
  	 * @method
  	 * @private
   */

  Modal.prototype._submit = function(ev) {
    var target;
    target = $(ev.currentTarget);
    if (!target.hasClass('loader')) {
      target.addClass('loader');
      this.$('button.cancel').hide();
      return this.trigger('submit');
    }
  };


  /*
  	 * @method
  	 * @private
   */

  Modal.prototype._cancel = function(ev) {
    if (ev != null) {
      ev.preventDefault();
    }
    this.trigger('cancel');
    return this.close();
  };


  /*
  	 * @method
   */

  Modal.prototype.close = function() {
    this.trigger('close');
    return modalManager.remove(this);
  };


  /*
  	 * Alias for close.
  	#
  	 * @method
   */

  Modal.prototype.destroy = function() {
    return this.close();
  };


  /*
  	 * @method
   */

  Modal.prototype.fadeOut = function(delay) {
    var speed;
    if (delay == null) {
      delay = 1000;
    }
    speed = delay === 0 ? 0 : 500;
    this.$(".modalbody").delay(delay).fadeOut(speed);
    return setTimeout(((function(_this) {
      return function() {
        return _this.close();
      };
    })(this)), delay + speed - 100);
  };


  /*
  	 * @method
   */

  Modal.prototype.message = function(type, message) {
    if (["success", "warning", "error"].indexOf(type) === -1) {
      return console.error("Unknown message type!");
    }
    this.$("p.message").show();
    return this.$("p.message").html(message).addClass(type);
  };


  /*
  	 * @method
  	 * @param {String} type One of success, warning, error
  	 * @param {String} message
  	 * @param {Delay} [delay] Time to wait before fading
   */

  Modal.prototype.messageAndFade = function(type, message, delay) {
    this.$(".modalbody .body").hide();
    this.$("footer").hide();
    this.message(type, message);
    return this.fadeOut(delay);
  };

  return Modal;

})(Backbone.View);

module.exports = Modal;



},{"./main.jade":4,"./manager":5}],4:[function(_dereq_,module,exports){
var jade = _dereq_("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (cancelAndSubmit, cancelValue, submitValue, title, titleClass) {
buf.push("<div class=\"overlay\"></div><div class=\"modalbody\"><header>");
if ( (title !== ''))
{
buf.push("<h2" + (jade.cls([titleClass], [true])) + ">" + (null == (jade_interp = title) ? "" : jade_interp) + "</h2>");
}
buf.push("<p class=\"message\"></p></header><div class=\"body\"></div>");
if ( (cancelAndSubmit))
{
buf.push("<footer><button class=\"cancel\">" + (jade.escape(null == (jade_interp = cancelValue) ? "" : jade_interp)) + "</button><button class=\"submit\">" + (jade.escape(null == (jade_interp = submitValue) ? "" : jade_interp)) + "</button></footer>");
}
buf.push("</div>");}.call(this,"cancelAndSubmit" in locals_for_with?locals_for_with.cancelAndSubmit:typeof cancelAndSubmit!=="undefined"?cancelAndSubmit:undefined,"cancelValue" in locals_for_with?locals_for_with.cancelValue:typeof cancelValue!=="undefined"?cancelValue:undefined,"submitValue" in locals_for_with?locals_for_with.submitValue:typeof submitValue!=="undefined"?submitValue:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"titleClass" in locals_for_with?locals_for_with.titleClass:typeof titleClass!=="undefined"?titleClass:undefined));;return buf.join("");
};
},{"jade/runtime":2}],5:[function(_dereq_,module,exports){
var $, ModalManager;

$ = _dereq_('jquery');


/*
 * @class
 */

ModalManager = (function() {

  /*
  	 * @method
   */
  function ModalManager() {
    this._modals = [];
  }


  /*
  	 * Add a modal (Backbone.View) to modalManager.
  	#
  	 * @method
  	 * @param {Modal} modal
   */

  ModalManager.prototype.add = function(modal) {
    var arrLength, m, _i, _len, _ref;
    _ref = this._modals;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      m = _ref[_i];
      m.$('.overlay').css('opacity', '0.2');
    }
    arrLength = this._modals.push(modal);
    modal.$('.overlay').css('z-index', 10000 + (arrLength * 2) - 1);
    modal.$('.modalbody').css('z-index', 10000 + (arrLength * 2));
    return $('body').prepend(modal.$el);
  };


  /*
  	 * Remove a modal (Backbone.View) to modalManager.
  	 * 
  	 * For now, the modal to be removed is always the last modal. In theory we could call Array.pop(),
  	 * but in the future we might implement a modal drag so underlying modals can be removed first.
  	 * @method
  	 * @param {Modal} modal
   */

  ModalManager.prototype.remove = function(modal) {
    var index;
    index = this._modals.indexOf(modal);
    this._modals.splice(index, 1);
    if (this._modals.length > 0) {
      this._modals[this._modals.length - 1].$('.overlay').css('opacity', '0.7');
    }
    modal.trigger('removed');
    modal.off();
    return modal.remove();
  };

  return ModalManager;

})();

module.exports = new ModalManager();



},{}]},{},[3])
(3)
});