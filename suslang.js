#!/usr/bin/env node
console.log('loading libraries...')
const fs = require('fs');
const path = require('path')
var UglifyJS = require("uglify-js");
var argv = process.argv.slice(2)
if (argv.includes('--help')) {
    console.log(`Usage: suslang <file> [options]
Options:
-o <file> - writes the output to another file
--spoof-version <version> - spoofs suslang version
--skip-file-version-check - skips file version check
--sync - does not add a top-level async function
--skip-minify - skips file minify
--env <key>-<value> - sets a environment variable (separated by ";") in the file
--env-file <file> - uses a file with a dotenv format and adds its environment variables to the result`);
process.exit(2)
}
console.log('starting with initial string...')
var string = "";
if (!argv[0]) {
    console.log('You need to provide a file to compile!');
    process.exit(1)
}
console.log('reading file...')
var file = fs.readFileSync(argv[0],{encoding: 'utf-8'});
var version = "0.0.1-alpha"
if (argv.includes('--spoof-version')) {
    var i = argv.indexOf('--spoof-version');
    if (!argv[i+1]) {console.log('invalid spoof version argument missing: version'); process.exit(1)};
    version = argv[i+1]
}

var suslang_module_name = "suslang"

var custom_pkgs = [
    {
        module_name: "amongus",
        var_name: "amongus_pkg",
        code: "{isSus: true,impostor: \"you\"}"
    },
    {
        module_name: "rng",
        var_name: "rng_gen",
        code: "max => Math.floor(Math.random() * max)"
    },
    {
        module_name: "choice",
        var_name: "choice",
        code: "arr => arr[Math.floor(Math.random() * arr.length)]"
    }
]

// check for stuff
console.log('checking for used functions...')
if (file.includes('sleep(')) {
    console.log('sleep() is used in the code, adding it...')
    string += "function sleep(m) {return new Promise(r => setTimeout(r,m))};\n";
}
if (file.includes('susify(')) {
    console.log('susify() is used in the code adding it...')
    string += "function susify(m) {return m.replace(/s/g,'sus')};\n";
}

if (file.includes('atob(')) {
    console.log('atob() is used in the code adding it...')
    string += "function atob(e) {return Buffer.from(e,'base64').toString('utf-8')};\n";
}
if (file.includes('btoa(')) {
    console.log('btoa() is used in the code adding it...')
    string += "function btoa(e) {return Buffer.from(e).toString('base64')};\n";
}


if (!argv.includes('--skip-file-version-check')) {
    console.log('checking version...')
    if (file.match(/version ('|"|`)(.*)('|"|`)/g)) {
        var ver = file.match(/version ('|"|`)(.*)('|"|`)/g)[0].slice(9,-1);
        if (version !== ver) {
            console.log('suslang is not in the required version('+ver+') cancelling compilation...')
            process.exit(1)
        }
        console.log('suslang matches the required version procedding...');
        
    }
}
file = file.replace(/version ('|"|`)(.*)('|"|`)/g,"")

if (file.includes('require("'+suslang_module_name+'")') || file.includes("require('"+suslang_module_name+"')") || file.includes("require(`"+suslang_module_name+"`)")) {
    console.log('suslang module is used in the code adding it...');
    string += `global.suslang = {
        version: "${version}"
    };\n`
}
custom_pkgs.forEach((pkg) => {
    if (file.includes('require("'+pkg.module_name+'")') || file.includes("require('"+pkg.module_name+"')") || file.includes("require(`"+pkg.module_name+"`)")) {
        pkg.var_name += "_"+Math.random().toString(36).slice(2,6);
        console.log(pkg.module_name+' module is used in the code adding it...');
        string += `global.${pkg.var_name} = ${pkg.code};`;
    }
})

// replace stuff
console.log('replacing stuff...')
file = file.replace(/printraw\(/g,"process.stdout.write(");
file = file.replace(/print\(/g,"console.log(");
file = file.replace(/sleep\(/g,"await sleep(");
file = file.replace(/require\(('|"|`)suslang('|"|`)\)/g,"global.suslang");
file = file.replace(/exit\(/g,"process.exit(");

for (var i = 0; i < custom_pkgs.length; i++) {
    var pkg = custom_pkgs[i];
    file = file.replace(new RegExp(`require\\(('|"|\`)${pkg.module_name}('|"|\`)\\)`,"g"),"global."+pkg.var_name);
}

//file = file.replace(/function\(/g,"async function(");

// add the file to the string with async because yes lol & minified
console.log('reading env vars...');

if (argv.includes('--env')) {
    var vars = argv[argv.indexOf('--env')+1].split(';');
    for (var i = 0; i < vars.length; i++) {
        string += `process.env[${JSON.stringify(vars[i].split('-')[0])}] = ${JSON.stringify(vars[i].split('-')[1])};`;
        console.log('setting var:',vars[i].split('-')[0])
    }
}
if (argv.includes('--env-file')) {
    var dfile = fs.readFileSync(argv[argv.indexOf('--env-file')+1],{encoding: 'utf-8'});

    var splitted = dfile.split('\n');
    splitted.forEach((e) => {
        var split2 = e.split('=')
        string += `process.env[${JSON.stringify(split2[0])}] = ${JSON.stringify(split2[1])};`
    })
    console.log('loaded env file')
}


if (argv.includes('--sync')) {
    console.log('adding file...');
    string += file;
} else {
    console.log('adding file to the string as an async function...')
    string += `(async()=>{${file}})()`
}

if (!argv.includes('--skip-minify')) {
    console.log('minifying...')
    var minified = UglifyJS.minify(string).code;
    if (minified) {
        string = minified;
    } else {
        console.log('failed to minify, continuing anyway...')
    }
}


console.log('writing file...')
// write file
if (argv.includes('-o')) {
    if (!argv[argv.indexOf('-o')+1]) {
        console.log('you need to add the file after -o like this: "-o hello.js"')
        process.exit(1)
    }
    fs.writeFileSync(argv[argv.indexOf('-o')+1],string);
    console.log('file saved as:',argv[argv.indexOf('-o')+1])
} else {
    fs.writeFileSync(argv[0].replace('.sus','')+".js",string)
    console.log('file saved as:',argv[0].replace('.sus','')+".js")
}
