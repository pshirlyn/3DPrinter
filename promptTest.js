var prompt = require('prompt')
    , arr = [];

function getAnother() {
    prompt.get('number', function (err, result) {
        if (err) done();
        else {
            arr.push(parseInt(result.number, 10));
            getAnother();
        }
    })
}

function done() {
    console.log(arr);
}


prompt.start();
getAnother();