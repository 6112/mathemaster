jQuery (function ($) {
  module ("core");
  
  test ("module components", function () {
    ok (_.isObject (Mathemaster), "Mathemaster exists");
    ok (_.isFunction (Mathemaster.Game), "Mathemaster.Game exists");
    ok (_.isObject (Mathemaster.Operator), "Mathemaster.Operator exists");
    ok (_.isFunction (Mathemaster.Question), "Mathemaster.Question exists");
  });
  
  test ("randomInDifficulty", function () {
    var tries = 100;
    var randoms = _.map (_.range (100), 
      _.partial (Mathemaster.randomInDifficulty, 1));
    ok (_.all (randoms, function (number) {
      return number >= 0;
    }), "positive integers");
    ok (_.all (randoms, function (number) {
      return number <= 100;
    }), "less than 100 for difficulty==1");
  });
  
  module ("game", {
    setup: function () {
      var fixture = $ ('#qunit-fixture');
      var screenWrapper = $ ('<div id="center-on-page"></div>');
      var screen = $ ('<div id="screen-game"></div>');
      screenWrapper.append (screen);
      fixture.append (screenWrapper);
    }
  });

  test ("constructor", function () {
    var game = new Mathemaster.Game (1, ['plus', 'minus', 'times']);
    var expectedFields = {difficulty: 1};
    var actualFields = _.pick (game, _.keys (expectedFields));
    deepEqual (actualFields, expectedFields, "fields populated correctly");
  });
  
  test ("start", function () {
    var game = new Mathemaster.Game (1, ['plus', 'minus', 'times']);
    var before = game.screenWrapper.html ();
    game.start ();
    ok (game._question, "game has a question set");
    notEqual (before, game.screenWrapper.html (), "html changed");
  });
  
  test ("history", function () {
    var game = new Mathemaster.Game (1, ['plus', 'minus', 'times']);
    deepEqual (game.history, [], "history initially empty");
    var question = new Mathemaster.Question (game, 
      Mathemaster.Operator.byName ('plus'), [8, 9], [6,7,8,9], 2);
    question.answerGiven = question.answer ();
    game.addToHistory (question);
    notEqual (game.history.indexOf (question), -1,
      "history contains question");
    equal (game.rightAnswerCount, 1,
      "correct number of right answers");
    question = new Mathemaster.Question (game,
      Mathemaster.Operator.byName ('plus'), [1,1], [1,2,3,4], 2);
    question.answerGiven = question.answer () + 1;
    game.addToHistory (question);
    equal (game.wrongAnswerCount, 1,
      "correct number of wrong answers");
  });
  
  module ("operator");
  
  test ("components", function () {
    ok (_.isFunction (Mathemaster.Operator.byName), 
      "Mathemaster.Operator.byName exists");
    ok (_.isArray (Mathemaster.Operator.list),
      "Mathemaster.Operator.list exists");
  });
  
  test ("operator existence", function () {
    equal (Mathemaster.Operator.byName ('plus').call (15, 9), 15 + 9, 
      "addition works");
    equal (Mathemaster.Operator.byName ('minus').call (15, 9), 15 - 9,
      "subtraction works");
    equal (Mathemaster.Operator.byName ('times').call (15, 9), 15 * 9,
      "multiplication works");
    equal (Mathemaster.Operator.byName ('over').call (15, 9), 15 / 9,
      "division works");
  });
  
  test ("byName", function () {
    var checkOperator = function (name) {
      var expected = _.select (Mathemaster.Operator.list, function (operator) {
        return operator.name === name;
      })[0];
      var actual = Mathemaster.Operator.byName (name);
      equal (expected, actual, name + " exists");
    };
    checkOperator ('plus');
    checkOperator ('minus');
    checkOperator ('times');
    checkOperator ('over');
  });
  
  module ("question", {
    setup: function () {
      this.game = new Mathemaster.Game (1, ['plus', 'minus', 'times']);
      this.operator = Mathemaster.Operator.byName ('times');
      var multiplicand = 12;
      var multiplier = 4;
      var operands = [multiplicand, multiplier];
      var result = this.operator.call (multiplicand, multiplier);
      var mystery = 2;
      var choices = [46, 47, 48, 49];
      this.fields = {
        game: this.game,
        operator: this.operator,
        operands: operands,
        result: result,
        choices: choices, 
        mystery: mystery
      };
      this.makeQuestion = _.bind (function () {
        return new Mathemaster.Question (this.game, this.operator, 
          this.fields.operands, this.fields.choices, this.fields.mystery);
      }, this);
    }
  });
  
  test ("constructor", function () {
    var question = this.makeQuestion ();
    var actualFields = _.pick (question, _.keys (this.fields));
    deepEqual (actualFields, this.fields, "fields populated correctly");
  });
  
  test ("answer", function () {
    var question = this.makeQuestion ();
    this.fields.mystery = 0;
    equal (question.answer (), question.result, 
      "result for mystery==2");
    this.fields.mystery = 1;
    question = this.makeQuestion ();
    equal (question.answer (), question.operands [1], 
      "second operand for mystery==1");
    this.fields.mystery = 0;
    question = this.makeQuestion ();
    equal (question.answer (), question.operands [0], 
      "first operand for mystery==0");
  });
  
  test ("makeAnswerTable", function () {
    var question = this.makeQuestion ();
    var table = question.makeAnswerTable ();
    notEqual (table.html ().indexOf (question.answer ()), -1, "contains answer");
  });
  
  test ("makeQuestionTable", function () {
    var question = this.makeQuestion ();
    var table = question.makeQuestionTable ();
    notEqual (table.html ().indexOf (question.operands [0]), -1, 
      "contains first operand");
    notEqual (table.html ().indexOf (question.operands [1]), -1,
      "contains second operand");
    this.fields.mystery = 1;
    question = this.makeQuestion ();
    table = question.makeQuestionTable ();
    notEqual (table.html ().indexOf (question.answer ()), -1,
      "contains result");
  });
  
  test ("isRight", function () {
    var question = this.makeQuestion ();
    question.answerGiven = question.answer ();
    ok (question.isRight (), "answer should be right");
    question.answerGiven = question.answer () + 1;
    ok (! question.isRight (), "answer should be wrong");
  });
});