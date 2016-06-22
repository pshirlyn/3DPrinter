var prompt = require('prompt');

var vm = require('vm');

var zeroCalc, graph, left, right, axis;

var math = require('mathjs');

var scope;

function read() {
    prompt.start();

    prompt.get(['input', 'leftBound', 'rightBound'], function (err, result) {
        if (err) {
            console.log(error);
        }
        graph = result.input.toString();
        left = parseInt(result.leftBound, 10);
        right = parseInt(result.rightBound, 10);
        output(initialize());
        var newFunc = math.parse(graph);
        scope = {
            x: 3
        };
        scope.x = left;
        var value = newFunc.eval(scope);
        var leftY = Math.round(value * 1000) / 1000;
        scope.x = right;
        var value = newFunc.eval(scope);
        var rightY = Math.round(value * 1000) / 1000;
        if (leftY > rightY) {
            layersLeft(leftY, rightY);
        }
        else {
            layersRight(leftY, rightY);
        }
        output(end());
    })
}

read();

var fs = require('fs');
var util = require('util');
var outputFile = fs.createWriteStream('printerOutput.gcode', { flags: 'w' });

var step;
var finished = false;

function layersLeft(leftBound, rightBound) {
    //increasing height 'i'
    step = 30 / (rightBound - leftBound);
    for (var i = leftBound; i <= rightBound + 0.3; i += (0.3 / step)) {
        output("G1 Z" + (Math.round((i * step + 0.225) * 1000) / 1000));
        getCoordinates(radius(i));
        getCoordinates(radius(i - 0.1));
    }
}

function layersRight(leftBound, rightBound) {
    //decreasing height 'i'
    step = 30 / (rightBound - leftBound);
    for (var i = rightBound - 0.3; i >= leftBound; i -= (0.3 / step)) {
        if (finished == false) {
            output("G1 Z" + Math.round((((rightBound + 0.3 - i) * step) + 0.225) * 10000) / 10000);
            getCoordinates(radius(i + 0.1));
            getCoordinates(radius(i));
        }
    }
}

output = function (d) { //
    outputFile.write(util.format(d) + '\n');
};



function getCoordinates(radius) {
    output("radius " + radius);
    for (var i = 0; i < Math.PI * 2; i += Math.PI / 18) {
        var xVal = Math.round(radius * Math.cos(i) * step * 1000) / 1000;
        var yVal = Math.round(radius * Math.sin(i) * step * 1000) / 1000;
        var extrusion = Math.sqrt(Math.pow(xVal, 2) + Math.pow(yVal, 2))/40;
        extrusion = Math.round(extrusion * 1000) / 1000;
        var command = "G1" + " " + "X" + (xVal + 100) + " Y" + (yVal + 100) + " E" + extrusion;
        if (extrusion == 0) {
            finished = true;
            break;
        }
        
        output(command);
    }
}

//inital settings
function initialize() {
    var initialSettings = "G21\nM107\nM190 S55\nM104 S196\nG28\nG1 Z5 F1800\nM109 S196\nG90\nG92 E0\nM83\nG1 F1800.000 E-1.00000\nG92 E1.00\nG1 Z0.225 F1800.000";
    return initialSettings;
}

var evalFunction = function (initFunc, xVal) {  
    scope.x = xVal;
    var value = initFunc.eval(scope);
    return value;
}

//returns target radius for a z height equal to the value of the variable value
function radius(value) {
    var result = graph.concat(" - "+ value);

    var newFunction = math.parse(result);

    var scope = {
        x: 3
    };

    var evalFunction = function (xVal) {
        scope.x = xVal;
        var value = newFunction.eval(scope);
        return value;
    }
    for (var i = -0.01; i < 60; i += 0.005) {
        var prevVal = evalFunction(i - 0.005);
        var nextVal = evalFunction(i);
        if (Math.abs(nextVal) <= 1e-10) {
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
            //i is the target radius
        }
    }

}

function end() {
    var endText = 'G92 E0\nM104 S0\nG28 X0\nM84';
    return endText;
}

