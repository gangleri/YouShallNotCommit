#!/usr/bin/env node

'use strict';

var childProc = require('child_process');

childProc.exec('git diff --cached --name-only', function(err, status) {
  if(err) {
    console.log('Error: ' + err);
    process.exit(1);
  }

  console.log('>>>>' + status);
});
