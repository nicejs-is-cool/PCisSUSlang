function sleep(m) {return new Promise(r => setTimeout(r,m))};
global.suslang = {
        version: "0.0.0-alpha"
    };
global.amongus_pkg_hp6c = {isSus: true,impostor: "you"};global.rng_gen_y1qg = max => Math.floor(Math.random() * max);global.choice_qrvx = arr => arr[Math.floor(Math.random() * arr.length)];
var suslang = global.suslang;
if (suslang.version !== "0.0.0-alpha") {
    console.log("hey bro you need 0.0.0-alpha to run this.");
    process.exit(1)
}
var impostor = global.amongus_pkg_hp6c

var rng = global.rng_gen_y1qg
var choice = global.choice_qrvx;
process.stdout.write(choice(['sus','hello'])+', world!');
await sleep(1000)
console.log(impostor)
await sleep(1000)
process.stdout.write('todays number is: ')
await sleep(500);
for (var i = 0; i < 10; i++) {
    process.stdout.write(rng(9).toString());
    await sleep(50)
}
process.stdout.write('\nyour luck is:');
for (var i = 0; i < 10; i++) {
    process.stdout.write(rng(9).toString());
    await sleep(10)
}
process.stdout.write('% luck');