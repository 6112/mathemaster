jQuery (function ($) {
    window.Mathemaster = window.Mathemaster || {};
    var Mathemaster = window.Mathemaster;

    Mathemaster.Stats = {
      data: [
        {
          gameCount: 0,
          rightAnswerCount: 0,
          wrongAnswerCount: 0
        },
        {
          gameCount: 0,
          rightAnswerCount: 0,
          wrongAnswerCount: 0
        },
        { 
          gameCount: 0,
          rightAnswerCount: 0,
          wrongAnswerCount: 0
        }
      ]
    };

    // converts a fraction (0 .. 1) to a string saying the percentage it
    // represents
    // e.g.: percent(0.43) === "43.0%"
    var percent = function(n) {
      return (n * 100).toFixed(1) + "%";
    };

    Mathemaster.Stats.show = function () {
      var statsScreen = $('#screen-statistics');
      $('table', statsScreen).remove();
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
          (((data.rightAnswerCount + data.wrongAnswerCount)
           / data.gameCount) || 0).toFixed(1),
           'Accuracy', percent(data.rightAnswerCount
                               / (data.wrongAnswerCount 
                                  + data.rightAnswerCount) || 0)
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
      var buttonBack = $('.back-button', '#screen-statistics');
      var goBack = function() {
        $(this).tooltip('destroy');
        $(this).off('click', goBack);
        statsScreen.hide(_.extend({
          complete: function() {
            $('#screen-welcome').show(Mathemaster.animation.screenChange);
          }
        }, Mathemaster.animation.screenChange));
        return false;
      };
      buttonBack.click(goBack);
      buttonBack.tooltip();
      statsScreen.append(wrapper);
      $('#screen-welcome').hide(_.extend({
        complete: function() {
          statsScreen.show(Mathemaster.animation.screenChange);
        }
      }, Mathemaster.animation.screenChange));
    };

    Mathemaster.Stats.hide = function() {
      $('#screen-welcome').show();
    };

    // called after game end, add the stats from this game to the global stats
    Mathemaster.Stats.push = function(data) {
      var out = Mathemaster.Stats.data[data.difficulty];
      out.rightAnswerCount += data.rightAnswerCount;
      out.wrongAnswerCount += data.wrongAnswerCount;
      out.gameCount++;
      Mathemaster.Stats.save();
    };

    // save the stats to localStorage
    Mathemaster.Stats.save = function() {
      var saveString = JSON.stringify(Mathemaster.Stats.data);
      localStorage.setItem('stats', saveString);
    };

    // load the stats from localStorage
    Mathemaster.Stats.load = function() {
      var saveString = localStorage.getItem('stats');
      if (saveString) {
        Mathemaster.Stats.data = JSON.parse(saveString);
      }
    };

    // load stats from localStorage
    Mathemaster.Stats.load();
});
