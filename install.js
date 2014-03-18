'use strict';

var fs = require('fs'),
    path = require('path');

console.log('Installing git pre-commit hook');

var gitPath = path.resolve('./', '../..');

while(!fs.existsSync(gitPath + '/.git')) {
  if(gitPath === '/') {
    console.log('No git repo found.');
    return 1;
  }
  gitPath = path.resolve(gitPath, '..');
}

var dest = path.resolve(gitPath, '.git', 'hooks', 'pre-commit');

if(!fs.existsSync(dest)) {
  fs.createReadStream(__dirname + '/pre-commit.js').pipe(fs.createWriteStream(dest, {mode: '0755'}));
} else {
  console.log('pre-commit already exists!');
}

