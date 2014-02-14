jQuery (function ($) {
  window.Mathemaster = window.Mathemaster || {};
  var Mathemaster = window.Mathemaster;
  
  var Operator = function (name, symbol, callback, pickRandomOperands) {
    this.name = name;
    this.symbol = symbol;
    this.call = callback;
    this.pickOperands = pickRandomOperands;
  };
  
  Mathemaster.Operator = {};
  
  Mathemaster.Operator.list = [
    /// addition
    new Operator ('plus', '+', function (x, y) { 
      return x + y; 
    }, function (difficulty) {
      return [
        Mathemaster.randomInDifficulty (difficulty),
        Mathemaster.randomInDifficulty (difficulty)
      ];
    }),
    
    /// subtraction
    new Operator ('minus', '&#8722;', function (x, y) {
      return x - y; 
    }, function (difficulty) {
      var operands = [Mathemaster.randomInDifficulty (difficulty)];
      operands.push (_.random (0, operands [0]));
      return operands;
    }),
    
    /// multiplication
    new Operator ('times', '&#215;', function (x, y) {
      return x * y; 
    }, function (difficulty) {
      return [
        Mathemaster.randomInDifficulty (difficulty),
        Mathemaster.randomInDifficulty (0)
      ];
    }),
    
    /// division
    new Operator ('over', '&#247;', function (x, y) {
      return x / y; 
    }, function (difficulty) {
      var result = Mathemaster.randomInDifficulty (0);
      var divisor = Mathemaster.randomInDifficulty (difficulty);
      var dividend = result * divisor;
      return [dividend, divisor];
    })
  ];
  
  Mathemaster.Operator.byName = function (name) {
    return _.filter (Mathemaster.Operator.list, function (operator) {
      return operator.name === name;
    }) [0];
  };
});