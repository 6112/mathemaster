jQuery (function ($) {
  window.Mathemaster = window.Mathemaster || {};
  var Mathemaster = window.Mathemaster;
  
  // time given to answer a single question
  var GIVEN_TIME = 8;
  
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
        $ ('<button id="button-back" class="big-button">Back</button>');
      this._buttonBack.click (function () {
        game.stop ();
      });
      this.screenWrapper.append (this._buttonBack);
      this._buttonBack.hide ();
      this._buttonBack.show (Mathemaster.animation.question);
      this._started = true;
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
      // this._buttonBack.remove ();
      this._buttonBack.hide (_.extend ({
        complete: _.bind (function () {
          this._buttonBack.remove ();
        }, this)
      }, Mathemaster.animation.disappear))
      this.screen.hide (_.extend ({
        complete: _.bind (function () {
          this.screen.empty ();
          $ ('#screen-welcome').show (Mathemaster.animation.screenChange);
        }, this)
      }, Mathemaster.animation.screenChange));
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
    var answerTable = question.makeAnswerTable ();
    problemElement.append (questionTableWrapper);
    problemElement.append (answerTable);
    return problemElement;
  };

  Mathemaster.Game.prototype.nextQuestion = function () {
    this._clock.reset ();
    this._clock.start ();
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
  
  Mathemaster.Game.prototype.addToHistory = function (question) {
    this.history.push (question);
    if (question.isRight ()) {
      this.rightAnswerCount++;
    }
    else {
      this.wrongAnswerCount++;
    }
  };
});