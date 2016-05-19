var prompt = require('prompt');

function read() {

    prompt.get(['input', 'leftBound', 'rightBound', 'axis'], function (err, result) {
        if (err) {
            console.log("hi");
        }
        console.log("Input received");
        graph = result.input.toString();
        left = parseInt(result.leftBound, 10);
        right = parseInt(result.rightBound, 10);
        axis = result.axis.toString();
        rainbow(graph, left, right, axis);
        read();
    })
}

prompt.start();
read();


function initialize() {
    var initialSettings = "G21 ; set units to millimeters";
}

function processing() {
    //initialize math.js
    math = mathjs();

    // 'scope' defines the variables available inside the math expression.
    scope = {
        x: 0
    },

    //expression as a tree
    tree;

    //sets expression
    function setExpr(newExpr) {
        expr = newExpr;
        tree = math.parse(expr, scope);
    }

    // Evaluates the current math expression 
    // Returns a Y coordinate
    function evalExpr(mathX) {

        // Set values on the scope visible inside the math expression.
        scope.x = mathX;

        // Evaluate the previously parsed math expression and return it
        return tree.eval();
    }
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

var fs = require('fs');

var graph, left, right, axis;


function rainbow(graph, left, right, axis) {
    console.log("Function to graph: " + graph);
    console.log("Left Bound: " + left);
    console.log("Right Bound: " + right);
    console.log("Axis: " + axis);
}

//console.log("Function to Graph: " + graph);

function output() {

    var output = 'printer.gcode';
    var stream = fs.createWriteStream(output);
}