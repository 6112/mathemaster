jQuery (function ($) {
  window.Mathemaster = window.Mathemaster || {};
  var Mathemaster = window.Mathemaster;
  
  var MYSTERY_FIRST_OPERAND = 0;
  var MYSTERY_SECOND_OPERAND = 1;
  var MYSTERY_RESULT = 2;
  
  Mathemaster.Question = function (game, operator, operands, choices, mystery) {
    this.game = game;
    this.operator = operator;
    this.operands = operands;
    this.result = operator.call (operands [0], operands [1]);
    this.choices = choices;
    this.mystery = mystery;
    this.answerGiven = undefined;
  };
  
  Mathemaster.Question.randomQuestion = function (game, operatorList, options) {
    operatorList = operatorList || Mathemaster.Operator.list;
    options = options || {};
    var operator = options.operator ||
      operatorList [_.random (0, operatorList.length - 1)];
    var operands = options.operands || [];
    var result;
    if (options.operands) {
      result = operator.call (operands [0], operands [1])
    }
    else {
      operands = operator.pickOperands (game.difficulty);
      result = operator.call (operands [0], operands [1]);
    }
    var mystery = options.mystery || _.random (0, 2);
    var answer = Mathemaster.Question.prototype.answer.call ({
      operands: operands,
      result: result,
      mystery: mystery
    });
    var choices;
    if (options.choices) {
      choices = options.choices;
    }
    else {
      choices = Mathemaster.Question._chooseChoices (answer);
    }
    return new Mathemaster.Question (game, operator, operands, choices, mystery);
  };
  
  Mathemaster.Question._chooseChoices = function (answer) {
    var choices;
    do {
      switch (_.random (0, 1)) {
        case 0:
          var offset = answer - _.random (0, 3);
          choices = [offset, offset + 1, offset + 2, offset + 3];
          break;
          
        case 1:
          var offset = answer + _.sample ([-1, 1]);
          var offset10 = answer + _.sample ([-10, 10]);
          var offset11 = offset10 + _.sample ([-1, 1]);
          choices = [answer, offset, offset10, offset11];
          break;
          
        case 2:
          var offset = answer + (_.random (0, 1) ? -1 : 1);
          var multiplied = answer * 2;
          var multipliedOffset = multiplied + (_.random (0, 1) ? -1 : 1);
          choices = [answer, offset, multiplied, multipliedOffset];
          break;
      }
    } while (_.min (choices) < 0);
    return choices.sort (function (a, b) {
      return a - b;
    });
  };
  
  Mathemaster.Question.prototype.makeQuestionTable = function () {
    var table = $ ('<table id="table-equation"></table>');
    var row = $ ('<tr></tr>');
    table.append (row);
    var cell = $ ('<td>' + (this.mystery === MYSTERY_FIRST_OPERAND ? '?' : this.operands [0]) + '</td>');
    row.append (cell);
    cell = $ ('<td>' + this.operator.symbol + '</td>');
    row.append (cell);
    cell = $ ('<td>' + (this.mystery === MYSTERY_SECOND_OPERAND ? '?' : this.operands [1]) + '</td>');
    row.append (cell);
    cell = $ ('<td>=</td>');
    row.append (cell);
    cell = $ ('<td>' + (this.mystery === MYSTERY_RESULT ? '?' : this.result) + '</td>');
    row.append (cell);
    return table;
  };
  
  /*Mathemaster.Question.prototype.makeAnswerTable = function () {
    var table = $ ('<table id="table-answer"></table>');
    var row = $ ('<tr></tr>');
    table.append (row);
    _.each (this.choices, _.bind (function (choice) {
      var cell = $ ('<td></td>');
      var button = $ ('<button class="big-button">' + choice + '</button>');
      button.click (_.bind (function () {
        this.answerGiven = choice;
        this.game.addToHistory (this);
        var animation;
        if (this.isRight ()) {
          animation = Mathemaster.animation.right;
        }
        else {
          animation = Mathemaster.animation.wrong;
        }
        this.game.screenWrapper.effect (animation);
        this.game.nextQuestion ();
      }, this));
      cell.append (button);
      row.append (cell);
    }, this));
    return table;
  };*/

  Mathemaster.Question.prototype.makeAnswerField = function() {
    var container = $('<div id="input-container">&nbsp;</div>');
    var field = $('<span id="input-field"></span>');
    var helpText1 = $('<span id="input-help-text-1"></span>');
    var helpText2 = $('<span id="input-help-text-2"></span>');
    helpText1.text('Type your answer~~');
    helpText1.show(Mathemaster.helpText.showEffect);
    container.append(helpText1);
    helpText2.text('Press Enter~~');
    container.append(helpText2);
    container.append(field);
    return container;
  };
  
  Mathemaster.Question.prototype.answer = function () {
    switch (this.mystery) {
      case MYSTERY_FIRST_OPERAND:
        return this.operands [0];
      case MYSTERY_SECOND_OPERAND:
        return this.operands [1];
      case MYSTERY_RESULT:
        return this.result;
    }
    return null;
  };
  
  Mathemaster.Question.prototype.isRight = function () {
    return this.answerGiven == this.answer ();
  };
});
