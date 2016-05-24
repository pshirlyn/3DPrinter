var prompt = require('prompt');

var vm = require('vm');

var zeroCalc, graph, left, right, axis;

var math = require('mathjs');

function read() {
    prompt.start();

    prompt.get(['input', 'leftBound', 'rightBound', 'axis'], function (err, result) {
        if (err) {
        }
        console.log("Input received");
        graph = result.input.toString();
        left = parseInt(result.leftBound, 10);
        right = parseInt(result.rightBound, 10);
        axis = result.axis.toString();
        prompt.stop();
        
    })
}

prompt.start();
read();

/*
rainbow();
processing(graph);
*/

function initialize() {
    var initialSettings = "G21\nM107\nM190 S55\nM104 S196\nG28\nG1 Z5 F5000\nM109 S196\nG90\nG92 E0\nM82\nG1 F1800.000 E-1.00000\nG92 E0\n";
    return initialSettings;
}

function processing(polynomial) {
    var node = math.parse(polynomial);

    zeroCalc = polynomial;

    var scope = {
        x: 3
    };

    var eval = node.eval(scope);

    console.log(eval);
}

function getCoordinates(angle, radius) {
    var xVal = radius * Math.cos(angle);
    var yVal = radius * Math.sin(angle);
    var command = "X"+xVal+" Y"+yVal;
    fs.writeFile(output, command);
    if(angle < Math.PI * 2) {
        getCoordinates(angle += Math.PI/18, radius);
    }
}

function zero(graph, value, left) {
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
    } else {
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

var fs = require('fs');

var graph, left, right, axis;


function rainbow() {
    console.log("Function to graph: " + graph);
    console.log("Left Bound: " + left);
    console.log("Right Bound: " + right);
    console.log("Axis: " + axis);
}

function output() {
    var output = 'printer.gcode';
    var stream = fs.createWriteStream(output);
    stream.once('open', function (fd) {
        stream.write(initialize());
        stream.end();
        console.log("complete");
    });
}