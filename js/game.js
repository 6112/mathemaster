jQuery (function ($) {
  window.Mathemaster = window.Mathemaster || {};
  var Mathemaster = window.Mathemaster;
  
  // "compile-time" options for debugging
  Mathemaster.options = {
    // whether to record statistics for the history
    history: false
  };

  // time given to answer a single question
  var GIVEN_TIME = 8;
  
  Mathemaster.helpText = {
    showEffect: {
      effect: 'fade',
      duration: 3000
    },
    hideEffect: {
      effect: 'fade',
      duration: 500
    }
  };

  Mathemaster.animation = Mathemaster.animation || {};
  
  _.extend (Mathemaster.animation, {
    question: {
      effect: 'fade',
      duration: 300
    },
    right: {
      effect: 'highlight',
      color: '#ccffcc',
      duration: 600,
      easing: 'easeInQuad'
    },
    wrong: {
      effect: 'highlight',
      color: '#ffcccc',
      duration: 600,
      easing: 'easeInQuad'
    },
    disappear: {
      effect: 'fade',
      duration: 600
    }
  });
  
  // table of difficulty names
  Mathemaster.difficulty = {
    easy: 0,
    normal: 1,
    hard: 2
  };
  
  Mathemaster.difficultyRange = [[0, 9], [10, 99], [100, 999]];
  
  Mathemaster.randomInDifficulty = function (difficulty) {
    var range = Mathemaster.difficultyRange [difficulty];
    return _.random (range [0], range [1]);
  };
  
  Mathemaster.Game = function (difficulty, selectedOperatorNames) {
    this.difficulty = difficulty;
    this.screen = $ ('#screen-game');
    this.screenWrapper = $ ('#center-on-page');
    this.history = [];
    this.rightAnswerCount = 0;
    this.wrongAnswerCount = 0;
    this._operatorList = _.map (selectedOperatorNames, function (operatorName) {
      return Mathemaster.Operator.byName (operatorName);
    });
    this._clock = null;
    this._buttonBack = null;
    this._question = null;
    this._started = false;
  };

  Mathemaster.Game.prototype.start = function () {
    var game = this;
    if (! this._started) {
      this._clock = this._makeClock ();
      this.screenWrapper.prepend (this._clock.element);
      this._clock.element.hide ();
      this._clock.element.show (Mathemaster.animation.question);
      this._buttonBack =
        $('<a href="#" class="ion-arrow-return-left" id="back-button"></a>');
      this._buttonBack = $('#back-button');
      this._buttonBack.click (function () {
        $(this).tooltip('destroy');
        game.stop ();
        return false;
      });
      this._buttonBack.attr({
        title: 'Back to home screen'
      });
      this._buttonBack.tooltip();
      this.screenWrapper.append (this._buttonBack);
      this._buttonBack.hide ();
      this._buttonBack.show (Mathemaster.animation.question);
      this._started = true;
      this.addKeyListener();
    }
    this.nextQuestion ();
  };
  
  Mathemaster.Game.prototype.stop = function () {
    if (this._started) {
      this._started = false;
      this._clock.element.hide (_.extend ({
        complete: _.bind (function () {
          this._clock.destroy ();
        }, this)
      }, Mathemaster.animation.disappear));
      this._buttonBack.hide (Mathemaster.animation.disappear);
      this.screen.hide (_.extend ({
        complete: _.bind (function () {
          this.screen.empty ();
          $('#screen-welcome').show (Mathemaster.animation.screenChange);
        }, this)
      }, Mathemaster.animation.screenChange));
      this.removeKeyListener();
      var ratio = this.rightAnswerCount / (this.rightAnswerCount + this.wrongAnswerCount);
      var hist = localStorage.getItem('history') || "[]";
      hist = JSON.parse(hist);
      hist.push(ratio);
      if (Mathemaster.options.history) {
        localStorage.setItem('history', JSON.stringify(hist));
      }
      // Mathemaster.Stats.show(this);
    }
  };
  
  Mathemaster.Game.prototype._makeClock = function () {
    var clock = new ClockWidget (GIVEN_TIME);
    clock.element.css ({
      position: 'absolute',
      top: 16,
      left: 16
    });
    clock.on ('finish', _.bind (function () {
      this.screenWrapper.effect (Mathemaster.animation.wrong);
      this.nextQuestion ();
    }, this));
    return clock;
  };
  
  Mathemaster.Game.prototype._makeProblemElement = function (question) {
    var problemElement = $ ('<div></div>');
    var questionTable = question.makeQuestionTable ();
    var questionTableWrapper = $ ('<h1></h1>');
    questionTableWrapper.append (questionTable);
    var answerField = question.makeAnswerField();
    problemElement.append (questionTableWrapper);
    problemElement.append(answerField);
    return problemElement;
  };

  Mathemaster.Game.prototype.nextQuestion = function () {
    this._clock.reset ();
    this._clock.start ();
    if (this._question) {
      this._addToHistory(this._question);
    }
    var proceed = _.bind (function () {
      var gameScreen = this.screen;
      gameScreen.empty ();
      var question = Mathemaster.Question.randomQuestion (this, this._operatorList);
      this._question = question;
      var problemElement = this._makeProblemElement (question);
      gameScreen.append (problemElement);
      problemElement.hide ();
      problemElement.show (Mathemaster.animation.question);
    }, this);
    var previousQuestionElement = this.screen.children ();
    if (previousQuestionElement [0]) {
      previousQuestionElement.hide (_.extend ({
        complete: proceed
      }, Mathemaster.animation.question));
    }
    else {
      proceed ();
    }
  };
  
  Mathemaster.Game.prototype._addToHistory = function (question) {
    this.history.push (question);
    if (question.isRight ()) {
      this.rightAnswerCount++;
    }
    else {
      this.wrongAnswerCount++;
    }
  };

  Mathemaster.Game.prototype.checkAnswer = function () {
    var answerText = $('#input-field').text();
    if (answerText === '' || answerText === '-') {
      return;
    }
    var answer = parseInt(answerText);
    this._question.answerGiven = answer;
    var animation;
    if(this._question.isRight()) {
      animation = Mathemaster.animation.right;
    }
    else {
      animation = Mathemaster.animation.wrong;
    }
    this.screenWrapper.effect(animation);
    this.nextQuestion();
  };

  Mathemaster.Game.prototype.addKeyListener = function() {
    var game = this;
    this._onKeyPress = function (event) {
      var key = event.key; // string or char representing the key pressed
      if ($('#input-field').length !== 0) {
        var entry = $('#input-field').text();
        if (key.toLowerCase() === 'backspace') {
          // remove the last character typed
          entry = entry.substring(0, entry.length - 1);
        }
        else if ('0123456789'.indexOf(key) !== -1) {
          if (entry.length < 8) {
            entry = entry + key;
          }
        }
        else if (key === '-') {
          if (entry.charAt(0) === '-') {
            entry = entry.substring(1);
          }
          else {
            entry = '-' + entry;
          }
        }
        else if (key === 'Enter') {
          game.checkAnswer();
        }
        $('#input-field').text(entry);
        // show or hide helper text depending on state
        if (entry === '') {
          $('#input-help-text-1').stop();
          $('#input-help-text-2').stop();
          $('#input-help-text-1').show(Mathemaster.helpText.showEffect);
          $('#input-help-text-2').hide(Mathemaster.helpText.hideEffect);
        }
        else if (entry.length === 1) {
          $('#input-help-text-1').stop();
          $('#input-help-text-2').stop();
          $('#input-help-text-1').hide(Mathemaster.helpText.hideEffect);
          $('#input-help-text-2').show(Mathemaster.helpText.showEffect);
        }
      }
    };
    $(document).keypress(this._onKeyPress);
  };

  Mathemaster.Game.prototype.removeKeyListener = function() {
    $(document).unbind('keypress', this._onKeyPress);
  };
});
