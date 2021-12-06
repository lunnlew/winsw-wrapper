import path from 'path';
import WinswWrapper from '../src/index';

let test = new WinswWrapper({
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
    .workdir(path.join(__dirname, '../'))
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
    .logpath(path.join(__dirname, '../log'))
    .logmode('append')
    .on('error', err => {
        console.log(err);
    })
    .on('start', (data) => {
        console.log(data);
    })
    .start()