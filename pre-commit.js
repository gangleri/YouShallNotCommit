#!/usr/bin/env node

'use strict';

var childProc = require('child_process');
var path = require('path');
var fs = require('fs');

function reportFailure(msg) {
  console.log(msg);
  console.log('\nYou can skip running re-commit hooks using the -n (--no-verify) option');
  console.log('\t $ git commit --no-verify');
  console.log('This is NOT advised!');

  process.exit(1);
}

childProc.exec('git diff --cached --name-only', function(err, status) {
  var cwd = process.cwd();

  if(err) {
    reportFailure('Error: ' + err);
  }

  var changes = status.split('\n').map(function buildPackagePath(file) {
    return path.join(cwd, path.dirname(file), 'package.json');
  }).filter(function removeNonExistigFiles(elm) {
    return fs.existsSync(elm);
  }).reduce(function removeDuplicates(prev, curr) {
    if(prev.indexOf(curr) < 0) {
      prev.push(curr);
    }
    return prev;
  }, []);


  changes.forEach(function(pkgPath) {
    var pkg = require(pkgPath);
    var scripts = [];

    if(pkg['pre-commit'] && Array.isArray(pkg['pre-commit'])) {
      scripts = pkg['pre-commit'];

      if(!scripts.length) {
        reportFailure('No script to execute');
      }

      scripts.forEach(function runScript(script) {
        childProc.spawn('npm', ['run-script', script], {
          cwd: cwd,
          stdio: [0,1,2]
        }).on('close', function checkScriptExit(code) {
          if(code !== 0) {
            process.exit(1);
          }
        });
      });
    }
  });

});

