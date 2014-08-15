'use strict';

var path = require('path');

var test = require('tape');
var readFiles = require('require-main')();

var fixturePaths = {
  a: path.join(__dirname, 'fixture_a.txt'),
  b: path.join(__dirname, 'fixture_b.txt')
};

test('fsReadFilePromise()', function(t) {
  t.plan(5);

  readFiles([fixturePaths.a, fixturePaths.b])
  .then(function(bufs) {
    t.equal(bufs[0].toString(), 'a\n', 'should read a file.');
  });

  readFiles([fixturePaths.b, fixturePaths.a])
  .then(function(bufs) {
    t.deepEqual(
      [bufs[0].toString(), bufs[1].toString()],
      ['b\n', 'a\n'],
      'should read multiple files.'
    );
  });

  readFiles(['./package.json', 'this/file/does/not.exists'])
  .catch(function(err) {
    t.equal(err.code, 'ENOENT', 'should be rejected with an error.');
  });

  readFiles(['./package.json'], {encoding: 'foo'})
  .catch(function(err) {
    t.deepEqual(err, new Error('Unknown encoding: foo'), 'should accept an option object.');
  });

  t.throws(
    readFiles.bind(null, './package.json'),
    new TypeError('./package.json is not an array.'),
    'should throw an type error when its first argument is not an array.'
  );
});
