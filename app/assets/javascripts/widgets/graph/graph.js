jQuery(function($) {
  window.Mathemaster = window.Mathemaster || {};
  var Mathemaster = window.Mathemaster;

  var DOT_SIZE = 16;

  Mathemaster.Graph = function(element, title, verticalAxisName,
                              horizontalAxisName, width, height) {
    element = element || $('<div></div>');
    if (_.isString (element)) {
      element = $(element);
    }
    this.wrapper = element;
    this.wrapper.css({
      display: 'inline-block'
    });
    this._canvasWrapper = $('<div></div>');
    this._canvasWrapper.css({
      position: 'relative',
      left: 0,
      top: 0
    });
    this.canvas = $('<canvas></canvas>');
    this.canvas.each(function() {
      this.width = width;
      this.height = height;
    });
    this.overlay = $('<div></div>');
    this.overlay.css({
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    });
    this.width = width;
    this.height = height;
    this._context = this.canvas[0].getContext('2d');
    this.title = title;
    this.verticalAxisName = verticalAxisName;
    this.horizontalAxisName = horizontalAxisName;
  };

  // `points' should be an array of y-values, in order.
  // y-values should be fractions (between 0 and 1)
  Mathemaster.Graph.prototype.setData = function(points) {
    this.data = points;
  };

  Mathemaster.Graph.prototype.draw = function() {
    this._titleLabel = $('<h1>' + this.title + '</div>');
    this._titleLabel.css({
      textAlign: 'center',
      marginBottom: 0
    });
    this._drawCanvas();
    this._canvasWrapper.append(this.canvas);
    this._canvasWrapper.append(this.overlay);
    this._verticalAxisLabel = $('<div>' + this.verticalAxisName + '</div>');
    var rotate = 'rotate(270deg)';
    this._verticalAxisLabel.css({
      width: this.height,
      textAlign: 'center',
      position: 'relative',
      top: Math.floor(this.height / 2),
      left: 16 - Math.floor(this.height / 2),
      '-ms-transform': rotate,
      '-moz-transform': rotate,
      '-webkit-transform': rotate,
      '-o-transform': rotate
    });
    this._horizontalAxisLabel = $('<div>' + this.horizontalAxisName + '</div>');
    this._horizontalAxisLabel.css({
      textAlign: 'center'
    });
    this.wrapper.empty();
    this.wrapper.append(this._titleLabel);
    this.wrapper.append(this._verticalAxisLabel);
    this.wrapper.append(this._canvasWrapper);
    this.wrapper.append(this._horizontalAxisLabel);
  };

  Mathemaster.Graph.prototype._drawCanvas = function() {
    this._canvasWrapper.css({
      left: 32,
      top: 0,
      marginRight: 48
    });
    this.canvas.css({
    });
    var context = this._context;
    // draw the background
    var backgroundGradient = context.createLinearGradient(0, 0,
                                                          0, this.height);
    backgroundGradient.addColorStop(0, '#FEFEFE');
    backgroundGradient.addColorStop(1, '#EEEEEE');
    context.fillStyle = backgroundGradient;
    context.fillRect(0, 0, this.width, this.height);
    // draw the axes
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, this.height);
    context.lineTo(this.width, this.height);
    context.strokeStyle = 'black';
    context.stroke();
    // draw the data
    if (_.isArray(this.data)) {
      var data = this.data;
      var dx = this.width / (data.length + 1);
      // draw the lines
      context.beginPath();
      context.moveTo(dx, (1 - data[0]) * this.height);
      var i;
      for (i = 1; i < data.length; i++) {
        context.lineTo((i + 1) * dx, (1 - data[i]) * this.height);
      }
      var dataGradient = context.createLinearGradient(0, 0, 
                                                      0, this.height);
      dataGradient.addColorStop(0, '#F44');
      dataGradient.addColorStop(1, '#822');
      context.strokeStyle = dataGradient;
      context.lineWidth = 2;
      context.stroke();
      // draw the dots
      context.beginPath();
      for (i = 0; i < data.length; i++) {
        var x = (i + 1) * dx;
        var y = (1 - data[i]) * this.height;
        context.moveTo(x + DOT_SIZE / 2, y);
        context.arc(x, y, DOT_SIZE / 2, 0, 2 * Math.PI, true);
        var dot = $('<div></div>');
        dot.css({
          width: DOT_SIZE,
          height: DOT_SIZE,
          position: 'absolute',
          left: Math.round(x) - DOT_SIZE / 2,
          top: Math.round(y) - DOT_SIZE / 2
        });
        dot.attr('title', Math.round(data[i] * 100) + '%');
        dot.tooltip({
          position: {
            at: 'center top',
            my: 'center bottom-5'
          }
        });
        this.overlay.append(dot);
      }
      context.fillStyle = dataGradient;
      context.fill();
      context.strokeStyle = '#622';
      context.lineWidth = 1;
      context.stroke();
    }
  };
});
