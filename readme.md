# Installation

```bash
npm i winsw-wrapper
# or
yarn add winsw-wrapper
```

# used winsw version

WinSW.NET2.exe v2.11.0

# Useage

```typescript
import path from "path";
import WinswWrapper, { WinswWrapperOptions } from "winsw-wrapper";

let test = new WinswWrapper({
  id: "test id",
  name: "test name",
  description: "test description",
  executable: "electron.exe",
} as WinswWrapperOptions);

test
  // .setWrapperBinPath(path.join(__dirname, '../../bin'))
  .setServiceAccount({
    allowservicelogon: false,
  })
  .afterFailure("reload", "10 sec")
  .resetFailure("1 hour")
  //   .arguments(__dirname)
  .arguments(path.join(__dirname, "../index.js"))
  .arguments("--start")
  .arguments("--AsService")
  // .arguments("--start --AsService")
  // .startarguments("--start --AsService")
  .workdir(path.join(__dirname, "../"))
  .priority("High")
  .stoptimeout("15 sec")
  .stopparenfirst(true)
  .stopexecutable("electron.exe")
  .stoparguments("--stop")
  .startmode("Automatic")
  .delayedAutoStart(true)
  .env("test", "test")
  .env("test1", "test1;test2")
  .depend("Eventlog")
  .depend("W32Time")
  .logpath(path.join(__dirname, "../log"))
  // .logmode('append')
  .logmode("roll-by-size", {
    sizeThreshold: 10240,
    keepFiles: 8,
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("install", (result) => {
    console.log(result);
    if (result.state === "success") {
      test.uninstall();
    } else if (result.state === "error" && result.data == "Existent") {
      test.uninstall();
    }
  })
  .on("uninstall", (result) => {
    console.log(result);
  })
  .install();
```

# Related

[winsw](https://github.com/winsw/winsw)

# License

winsw-wrapper is licensed under the MIT license.
