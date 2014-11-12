jQuery (function ($) {
    window.Mathemaster = window.Mathemaster || {};
    var Mathemaster = window.Mathemaster;

    Mathemaster.Stats = {
      data: [
        {
          gameCount: 3,
          accuracy: 0.87,
          rightAnswerCount: 37,
          wrongAnswerCount: 3
        },
        {
          gameCount: 3,
          accuracy: 0.87,
          rightAnswerCount: 37,
          wrongAnswerCount: 3
        },
        { 
          gameCount: 3,
          accuracy: 0.87,
          rightAnswerCount: 37,
          wrongAnswerCount: 3
        }
      ]
    };

    var entries = [];
    _.each(entries, function(entry) {
    });

    // converts a fraction (0 .. 1) to a string saying the percentage it
    // represents
    // e.g.: percent(0.43) === "43.0%"
    var percent = function(n) {
      return (n * 100).toFixed(1) + "%";
    };

    Mathemaster.Stats.show = function () {
      var statsScreen = $('#screen-statistics');
      statsScreen.empty();
      var difficulties = ['Easy', 'Medium', 'Hard'];
      var i;
      var wrapper = $('<table class="stats-table"></table>');
      var wrapperRow = $('<tr></tr>');
      for (i = 0; i < difficulties.length; i++) {
        var wrapperCell = $('<td></td>');
        wrapperCell.html('<h1>' + difficulties[i] + '</h1>');
        wrapperRow.append(wrapperCell);
      }
      wrapper.append(wrapperRow);
      wrapperRow = $('<tr></tr>');
      for (i = 0; i < difficulties.length; i++) {
        var table = $('<table class="table"></table>');
        var data = Mathemaster.Stats.data[i];
        var entries = [
          'Games played', data.gameCount,
          'Correct answers', data.rightAnswerCount,
          'Wrong answers', data.wrongAnswerCount,
          'Questions per game',
          ((data.rightAnswerCount + data.wrongAnswerCount)
           / data.gameCount).toFixed(1),
           'Accuracy', percent(data.accuracy)
        ];
        var j;
        for (j = 0; j < entries.length; j += 2) {
          var title = entries[j];
          var value = entries[j + 1];
          var row = $('<tr></tr>');
          row.append('<th>' + title + '</th>');
          row.append('<td>' + value + '</td>');
          table.append(row);
        }
        var wrapperCell = $('<td></td>');
        wrapperCell.append(table);
        wrapperRow.append(wrapperCell);
      }
      wrapper.append(wrapperRow);
      statsScreen.append(wrapper);
      $('#screen-welcome').hide(_.extend({
        complete: function() {
          statsScreen.show(Mathemaster.animation.screenChange);
        }
      }, Mathemaster.animation.screenChange));
    };

    Mathemaster.Stats.hide = function () {
      $('#screen-welcome').show();
    };
});
