var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream('math.txt', { flags: 'w' });

output = function (d) { //
    log_file.write(util.format(d) + '\n');
};

getCoordinates(1);

function getCoordinates(radius) {
   for (var i = 0; i < Math.PI * 2; i += Math.PI/18) {
       var xVal = Math.round(radius * Math.cos(i) * 1000) / 1000;
       var yVal = Math.round(radius * Math.sin(i) * 1000) / 1000;
       var command = "X" + xVal + " Y" + yVal;
       output(command);
   }
}