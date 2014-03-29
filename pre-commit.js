#!/usr/bin/env node

'use strict';

var childProc = require('child_process');
var path = require('path');
var fs = require('fs');

function displayError() {
  console.log('');
  console.log('');
  console.log('                                   \x1B[34m-----');
  console.log('                                 //////\\');
  console.log('                              /////////\\');
  console.log('                           //////////////\\');
  console.log('                            //////////////\\');
  console.log('                           //////////////\\\\');
  console.log('                           //////////////\\\\\\');
  console.log('                         ////////////////\\\\\\');
  console.log('                       //////////////////\\\\\\');
  console.log('                     ///////////////////\\\\\\\\');
  console.log('                 /----//////////////////\\\\\\\\    ');
  console.log('              /---/////////////////////-----\\');
  console.log('            /----------------------------------\\');
  console.log('          /-/////////////\x1B[39m   ___|  |___   \x1B[34m|-----------\\');
  console.log('          |-///////////|\x1B[39m    \x1B[90m===\x1B[39m|  |\x1B[90m===\x1B[90m   \x1B[34m|-----------|');
  console.log('          \\-///////////|\x1B[39m   /__\x1B[32mO\x1B[39m|  |\x1B[32mO\x1B[39m__\\  \x1B[34m|-----------/');
  console.log('           \\///////////|\x1B[39m    -- |  | --   \x1B[34m|----------/');
  console.log('            -----------|\x1B[39m\\     {.  .}     /\x1B[34m----------\x1B[39m');
  console.log('                         \\  \x1B[90m/^^^^^^^^\\  /');
  console.log('                          \\\x1B[90m/^ \x1B[31m------\x1B[39m \x1B[90m^\\/');
  console.log('                          |  ^     ^  ^|');
  console.log('                          |^   ^  ^  ^ |');
  console.log('                          | ^   ^  ^  ^|');
  console.log('                          |^  ^  ^  ^  |');
  console.log('                          \\  ^  ^  ^ ^ /');
  console.log('                           \\  ^  ^  ^ /');
  console.log('                            \\--------/');
  console.log('');
  console.log(' \x1B[31m_                         _            _   _                    ');
  console.log('(_|   |                   | |          | | | |                   ');
  console.log('  |   |  __            ,  | |     __,  | | | |    _  _    __ _|_ ');
  console.log('  |   | /  \\_|   |    / \\_|/ \\   /  |  |/  |/    / |/ |  /  \\_|  ');
  console.log('   \\_/|/\\__/  \\_/|_/   \\/ |   |_/\\_/|_/|__/|__/    |  |_/\\__/ |_/');
  console.log('     /|                                                          ');
  console.log('     \\|                                                          ');
  console.log('                                      ');
  console.log('                                o     ');
  console.log(' __   __   _  _  _    _  _  _     _|_ ');
  console.log('/    /  \\_/ |/ |/ |  / |/ |/ |  |  |  ');
  console.log('\\___/\\__/   |  |  |_/  |  |  |_/|_/|_/');
  console.log('                                      \x1B[39m');
}

childProc.exec('git diff --cached --name-only', function(err, status) {
  var cwd = process.cwd();
  var prefix = '\x1B[30m\x1B[46m[git-pre]\x1B[49m\x1B[39m';

  if(err) {
    process.exit(1);
  }

  var packages = status.split('\n').map(function buildPackagePath(file) {
    var parts = ['/'].concat(file.split('/'));
    for(var i=parts.length; i>0;i--) {
      var f = cwd + path.join.apply(path, parts.slice(0, i))+'/package.json';
      if(fs.existsSync(f)) { return f; }
    }
  }).reduce(function removeDuplicates(prev, curr) {
    if(prev.indexOf(curr) < 0 && fs.existsSync(curr)) {
      prev.push(curr);
    }
    return prev;
  }, []);

  function processPkg(pkgPath, results, cb) {
    var pkg;
    if(!pkgPath || !(pkg = require(pkgPath)) || !pkg['pre-commit']) {
      results.exitCode = 1;
      cb(results);
    }

    function runScript(script, cb) {
      childProc.spawn('npm', ['run-script', script], {
        cwd: path.dirname(pkgPath),
        env: process.env,
        stdio: [0, 1, 2]
      }).on('close', function(code) {
        results.packageResults[pkgPath] = results.packageResults[pkgPath] || [];
        results.packageResults[pkgPath].push({script: script,
          result: !code ? '\x1B[32mPass\x1B[39m' : '\x1B[31mFail\x1B[39m'});
        if(code) { results.exitCode = code; }
        cb();
      });
    }
    
    runScript(pkg['pre-commit'].shift(), function scriptDone() {
      if(pkg['pre-commit'].length) {
        runScript(pkg['pre-commit'].shift(), scriptDone);
      } else { cb(results); }
    });
  }
  
  console.log(prefix + ' Running package scripts.');
  processPkg(packages.shift(), {exitCode: 0, packageResults:{}}, function packageDone(results) {
    if(packages.length) {
      processPkg(packages.shift(), results, packageDone);
    } else {
      console.log('\n\n' + prefix + ' Done.');
      Object.keys(results.packageResults).forEach(function(p) {
        console.log('\n' + prefix + ' \x1B[1mPackage: \x1B[22m' + path.dirname(path.relative('.', p)));
        results.packageResults[p].forEach(function(s) {
          console.log('\t' + s.script + ':\t\t' + s.result);
        });
      });

      if(results.exitCode !== 0) {
        displayError();
        console.log('\npre-commit hooks \x1B[31m\x1B[1mFAILED\x1B[22m\x1B[39m, your commit has been aborted. See above for details.');
        console.log('Correct the above failures or force the commit with: git commit --no-verify');
      }
      process.exit(results.exitCode);
    }
  });
});

