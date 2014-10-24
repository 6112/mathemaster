jQuery (function ($) {
    window.Mathemaster = window.Mathemaster || {};
    var Mathemaster = window.Mathemaster;

    Mathemaster.Stats = {};

    Mathemaster.Stats.show = function () {
        // $ ('#screen-statistics').show ();
        var graphArea = $ ('<div id="chart-wrapper"></div>');
        var graph = new Mathemaster.Graph(graphArea, 'Performance',
                                          'Correct Answers (%)',
                                          'Time',
                                          400, 300);
        var hist = localStorage.getItem('history') || "[]";
        hist = JSON.parse(hist);
        graph.setData(hist);
        graph.draw();
        $('#screen-statistics').empty();
        $('#screen-statistics').append(graphArea);
        // $('#screen-welcome').hide();
        $('#screen-welcome').hide(_.extend({
          complete: function() {
            $('#screen-statistics').show(Mathemaster.animation.screenChange);
          }
        }, Mathemaster.animation.screenChange));
    };

    Mathemaster.Stats.hid = function () {
      $('#screen-welcome').show();
    };
});
