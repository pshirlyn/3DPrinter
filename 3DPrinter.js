var prompt = require('prompt');

var vm = require('vm');

var zeroCalc, graph, left, right, axis;

var math = require('mathjs');

function read() {
    prompt.start();

    prompt.get(['input', 'leftBound', 'rightBound', 'axis'], function (err, result) {
        if (err) {
            console.log(error);
        }
        graph = result.input.toString();
        left = parseInt(result.leftBound, 10);
        right = parseInt(result.rightBound, 10);
        axis = result.axis.toString();
        output(initialize());
        getCoordinates(2);
        getCoordinates(2 - 0.3);
        getCoordinates(2 - 0.6);
    })
}

read();

/*
rainbow();
processing(graph);
*/
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream('math.txt', { flags: 'w' });

output = function (d) { //
    log_file.write(util.format(d) + '\n');
};



function getCoordinates(radius) {
    for (var i = 0; i < Math.PI * 2; i += Math.PI / 18) {
        var xVal = Math.round(radius * Math.cos(i) * 1000) / 1000;
        var yVal = Math.round(radius * Math.sin(i) * 1000) / 1000;
        var extrusion = Math.sqrt(Math.pow(xVal, 2) + Math.power(yVal, 2)) * 0.0395;
        var command = "G1"+ " "+ "X" + xVal + " Y" + yVal;
        output(command);
    }
}

function initialize() {
    var initialSettings = "G21\nM107\nM190 S55\nM104 S196\nG28\nG1 Z5 F5000\nM109 S196\nG90\nG92 E0\nM83\nG1 F1800.000 E-1.00000\nG92 E0\n";
    return initialSettings;
}

function zVal(value, left) {
    var result = graph.concat(" "+value);

    var newFunction = math.parse(result);

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
            var nextVal = evalFunction(i);
            if (nextVal == 0) {
                return i;
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
    } /*else {
        for (var i = rightBound; i >= rightBound; i -= 0.001) {
            var prevVal = evalFunction(i + 0.001);
            var nextVal = evalFunction(i);
            if (nextVal == 0) {
                return i;
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
    */
       
}
/*
function calculateZero(prevGuess, step, max) {
    for (var i = step; i <= max; i += step) {
        var prevX = prevGuess + i - step;
        var nextX = prevGuess + i;
        //calculates previous y value
        var prevVal = evalExpr(prevX);
        //calculates next y value
        var nextVal = evalExpr(nextX);
        if (nextVal == 0) {
            zeroes.push(nextX);
        }
        else if (prevVal == 0) {
            //do nothing as sign can't have changed
        }
            //if same sign
        else if ((nextVal < 0 && prevVal < 0) || (nextVal > 0 && prevVal > 0)) {
            //do nothing
        }
            //if different signs
        else {
            //add to zeroes array and continue
            return prevGuess + i;
        }
    }

}
*/

