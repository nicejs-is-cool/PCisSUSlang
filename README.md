# suslang CLI
### Install
`npm i -g suslang`
### code example:
```js
version '0.0.1-alpha' // used to make sure the compiler is in the exact version
var suslang = require('suslang');
// not needed you can remove this if you want
if (suslang.version !== "0.0.1-alpha") {
    print("hey bro you need 0.0.1-alpha to run this. you have: "+suslang.version+" install 0.0.1-alpha then recompile this file");
    exit(1)
}
var impostor = require('amongus')

var rng = require('rng')
var choice = require('choice');
printraw(choice(['sus','hello'])+', world!');
sleep(1000)
print(" "+btoa('hm sussy!'))
sleep(1000)
printraw('todays number is: ')
sleep(500);
for (var i = 0; i < 10; i++) {
    printraw(rng(9).toString());
    sleep(50)
}
printraw('\nyour luck is:');
for (var i = 0; i < 10; i++) {
    printraw(rng(9).toString());
    sleep(10)
}
printraw('% luck');
```
### How to use the CLI
```sh
$ suslang --help
loading libraries...
Usage: suslang <file> [options]
Options:
-o <file> - writes the output to another file
--spoof-version <version> - spoofs suslang version
--skip-file-version-check - skips file version check
--sync - does not add a top-level async function
--skip-minify - skips file minify
--env <key>-<value> - sets a environment variable (separated by ";") in the file
--env-file <file> - uses a file with a dotenv format and adds its environment variables to the result
```
### CLI Example
```
$ suslang test.sus
...
file saved as: test.js
```
If you need to save it in another name you can use:
```
$ suslang test.sus -o helloworld.js
...
file saved as: helloworld.js
```
