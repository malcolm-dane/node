var express = require('express'),
 cp = require('child_process'),
 childProcess =require('./example-poa.js'),

  app = express(),
  http = require('http'),
  httpServer = http.Server(app);
const { fork } = require("child_process");
const { spawn } = require('child_process');
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});



function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

//Proof Of authority
app.get('/poa', function(req, res) {
const child = fork("example-poa.js");
});

//Proof Of Stake
app.get('/pos', function(req, res) {
const child = fork("example-pos.js");
});


//Proof Of Work
app.get('/pow', function(req, res) {
const child = fork("example-pow.js");
});
app.get('/msg', function(req, res){
   // res.writeHead(200, { "Content-Type": "text/json",
            //             "Cache-control": "no-cache" });

    var spw = fork("example-poa.js");
    str = "";

    spw.stdout.on('data', function (data) {
        str += data.toString();

        // just so we can see the server is doing something
        console.log("data");

        // Flush out line by line.
        var lines = str.split("\n");
        for(var i in lines) {
            if(i == lines.length - 1) {
                str = lines[i];
            } else{
                // Note: The double-newline is *required*
                res.write('data: ' + lines[i] + "\n\n");
          // res.send(200).json('data: ' + lines[i] + "\n\n");
            }
        }
    });

    spw.on('close', function (code) {
        res.send(str);
        // res.send(200).json('data: ' + str + "\n\n");
    });

    spw.stderr.on('data', function (data) {
        res.send('stderr: ' + data);
    });
});

// Now we can run a script and invoke a callback when complete, e.g.

app.listen(3000);