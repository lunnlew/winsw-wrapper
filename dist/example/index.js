"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const index_1 = (0, tslib_1.__importDefault)(require("../src/index"));
let test = new index_1.default({
    id: 'test id',
    name: 'test name',
    description: 'test description',
    executable: 'electron.exe',
});
test
    // .setWrapperBinPath(path.join(__dirname, '../../bin'))
    .setServiceAccount({
    allowservicelogon: false
})
    .afterFailure('restart', '10 sec')
    .resetFailure('1 hour')
    .arguments('--AsService')
    .startarguments('--start --AsService')
    .workdir(path_1.default.join(__dirname, '../'))
    .priority('High')
    .stoptimeout('15 sec')
    .stopparenfirst(true)
    .stopexecutable('electron.exe')
    .stoparguments('--stop')
    .startmode('Automatic')
    .delayedAutoStart('10 sec')
    .env('test', 'test')
    .env('test1', 'test1;test2')
    .depend('Eventlog')
    .depend('W32Time')
    .logpath(path_1.default.join(__dirname, '../log'))
    .logmode('append')
    .on('error', err => {
    console.log(err);
})
    .on('install', (result) => {
    console.log(result);
    if (result.state === 'success') {
        test.uninstall();
    }
    else if (result.state === 'error' && result.data == 'Existent') {
        test.uninstall();
    }
})
    .on('uninstall', (result) => {
    console.log(result);
})
    .install();
//# sourceMappingURL=index.js.map