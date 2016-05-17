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

var output = 'printer.gcode';

var input, left, right, axis;

var stream = fs.createWriteStream(output);

input();


function input() {
    /*
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
     * */
    /*
    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', () => {
    */
    /*
    fs.readFile('input.txt', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        fs.writeFile(output, data);

    });
    */
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('input.txt')
    });
 

    lineReader.on('line', function (line) {
        console.log('Line from file:', line);
    });

};

