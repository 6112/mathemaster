jQuery (function ($) {
  window.Mathemaster = window.Mathemaster || {};
  var Mathemaster = window.Mathemaster;
  
  Mathemaster.animation = Mathemaster.animation || {};
  
  _.extend (Mathemaster.animation, {
    screenChange: {
      effect: 'fade',
      duration: 600
    }
  });

  $ ('#start-playing-button').click (function () {
    $ ('#screen-welcome').hide (_.extend ({
      complete: function () {
        $ ('#screen-game').show ();
        var operatorNames = [];
        $ ('#screen-welcome input[type=checkbox]').each (function () {
          var self = $ (this);
          if (self.is (':checked')) {
            var id = self.attr ('id');
            var operatorName = id.match (/-(\w+)$/)[1];
            operatorNames.push (operatorName);
          }
        });
        var difficulty = 
          $ ('input[name=difficulty]:checked', '#screen-welcome').val ();
        difficulty = parseInt (difficulty);
        var game = new Mathemaster.Game (difficulty, operatorNames);
        game.start ();
      }
    }, Mathemaster.animation.screenChange));
  });

  $('#view-stats-link').click(function() {
    Mathemaster.Stats.show();
    return false;
  }).tooltip({
    position: {
      at: "center top",
      my: "center bottom"
    }
  });
});
