(function () {
  var $ = jQuery;
  
  /**
   * Class for a circular countdown widget.
   * 
   * @class ClockWidget
   * @constructor
   * @param {Number} duration Duration for the clock, in seconds.
   * @param {Number} [updateInterval=1] Interval between updates on the clock 
   *  (how often it 'ticks'), in seconds.
   */
  var ClockWidget = window.ClockWidget = function (duration, updateInterval) {
    var markup = [
      '<div class="clock-wrapper">',
        '<div class="clock-background"></div>',
        '<div class="clock-slice">',
          '<div class="slice"></div>',
        '</div>',
      '</div>'
    ].join ('');
    /**
     * jQuery element representing the clock's wrapper.
     * 
     * @property markup
     * @type jQuery
     */
    this.element = $ (markup);
    /**
     * Duration of the clock, in seconds.
     * 
     * @property duration
     * @type Number
     */
    this.duration = duration;
    /**
     * Time elapsed on the clock, in seconds.
     * 
     * @property timeElapsed
     * @type Number
     */
    this.timeElapsed = 0;
    this.interval = updateInterval ? updateInterval : 1;
    this._timeout = null;
    this._handlers = {
      /**
       * Fired when the clock's countdown is started.
       * 
       * @event start
       */
      start: [],
      /**
       * Fired when the clock has finished counting down.
       * 
       * @event finish
       */
      finish: [],
      /**
       * Fired when the clock is paused.
       * 
       * @event pause
       */
      pause: [],
      /**
       * Fired when the clock updates.
       * 
       * @event updates
       */
      update: [],
      /**
       * Fired when the clock is destroyed.
       * 
       * @event destroy
       */
      destroy: []
    };
  };
  
  /**
   * Destroy this ClockWidget and delete its corresponding HTML element.
   * 
   * @method destroy
   */
  ClockWidget.prototype.destroy = function () {
    this.element.remove ();
    if (this._timeout) {
      clearTimeout (this._timeout);
    }
    this.trigger ('destroy');
  };
  
  /**
   * Update the clock, showing the amount of time elapsed.
   * 
   * @method update
   */
  ClockWidget.prototype.update = function () {
    this.timeElapsed = Math.min (this.timeElapsed, this.duration);
    this.timeElapsed = Math.max (this.timeElapsed, 0);
    var degrees = Math.round (this.timeElapsed / this.duration * 360);
    var slice = $ ('.clock-slice > .slice', this.element);
    var slice2 = $ ('.clock-slice2 > .slice', this.element);
    if (degrees < 180) {
      slice.css ('transform', 'rotate(' + degrees + 'deg)');
      slice2.css ('transform', 'rotate(0deg)');
    }
    else {
      if (! slice2 [0]) {
        slice2 = $ ('<div class="clock-slice2"><div class="slice"></div></div>');
        this.element.append (slice2);
        slice2 = $ ('.slice', slice2);
      }
      slice.css ('transform', 'rotate(180deg)');
      slice2.css ('transform', 'rotate(' + (degrees - 180) + 'deg)');
    }
    this.trigger ('update');
  };
  
  /**
   * Start the clock's countdown.
   * 
   * @method start
   */
  ClockWidget.prototype.start = function () {
    var callback = _.bind (function () {
      this.timeElapsed += this.interval;
      this.update ();
      if (this.timeElapsed < this.duration) {
        this._timeout = setTimeout (callback, this.interval * 1000);
      }
      else {
        this.finish ();
      }
    }, this);
    this._timeout = setTimeout (callback, this.interval * 1000);
    this.trigger ('start');
  };
  
  /**
   * Pause the clock's countdown.
   * 
   * @method pause
   */
  ClockWidget.prototype.pause = function () {
    if (this._timeout) {
      clearTimeout (this._timeout);
    }
    this.trigger ('pause');
  };
  
  /**
   * Finish the clock's countdown early.
   * 
   * @method finish
   */
  ClockWidget.prototype.finish = function () {
    this.timeElapsed = this.duration;
    this.update ();
    clearTimeout (this._timeout);
    this.trigger ('finish');
  };
  
  /**
   * Reset the clock's countdown to 0 and pause it.
   * 
   * @method reset
   */
  ClockWidget.prototype.reset = function () {
    this.pause ();
    this.timeElapsed = 0;
    this.update ();
  };
  
  /**
   * Add a handler for the given event name `event`, with callback function
   * `handler`.
   * 
   * @method on
   * @param {String} event Name of the event to handle.
   * @param {Function} handler Function to be called when the event is fired.
   *  Will have the ClockWidget bound to `this`, and will receive two arguments:
   *  the ClockWidget, and the event name.
   */
  ClockWidget.prototype.on = function (event, handler) {
    if (! _.isArray (this._handlers [event])) {
      throw new Error ('unknown event type: ' + event);
    }
    if (! _.isFunction (handler)) {
      throw new Error ('handler must be a function');
    }
    this._handlers [event].push (handler);
  };
  
  /**
   * Fire a given event.
   * 
   * @method trigger
   * @param {String} event Name of the event to fire.
   */
  ClockWidget.prototype.trigger = function (event) {
    if (! _.isArray (this._handlers [event])) {
      throw new Error ('unknown event type: ' + event);
    }
    _.each (this._handlers [event], _.bind (function (handler) {
      handler.call (this, this, event);
    }, this));
  };
}) ();