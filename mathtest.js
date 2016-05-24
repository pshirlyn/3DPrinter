var math = require('mathjs');

var leftBound = 0;

var rightBound = 6;

function zero(graph, value, left) {
    var result = graph.concat(" - " + value);

    var newFunction = math.parse(result);

    console.log(result);

    var scope = {
        x: 3
    };

    var evalFunction = function (xVal) {
        scope.x = xVal;
        var value = newFunction.eval(scope);
        return value;
    }

    if (left == true) {
        for (var i = leftBound; i <= rightBound; i += 0.001) {
            var prevVal = evalFunction(i - 0.001);
            console.log(i, nextVal);
            var nextVal = evalFunction(i);
            if (nextVal == 0) {
                return nextVal;
            }
            else if (prevVal == 0) {
            }
                //if same sign
            else if ((nextVal < 0 && prevVal < 0) || (nextVal > 0 && prevVal > 0)) {
                //do nothing
            }
                //if different signs
            else {
                return i;
            }
        }
    } else {
        for (var i = rightBound; i >= rightBound; i -= 0.001) {
            var prevVal = evalFunction(i + 0.001);
            var nextVal = evalFunction(i);
            if (nextVal == 0) {
                return nextVal;
            }
            else if (prevVal == 0) {

            }
                //if same sign
            else if ((nextVal < 0 && prevVal < 0) || (nextVal > 0 && prevVal > 0)) {
                //do nothing
            }
                //if different signs
            else {
                return i;
            }
        }
    }

}

console.log(zero("x ^ 2", 4, true));