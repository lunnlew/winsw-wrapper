"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const bin_1 = (0, tslib_1.__importDefault)(require("./bin"));
class WinCmd {
    /**
     * exec
     * @param cmd 要执行的命令
     * @param options 选项配置
     * @returns
     */
    cmd_exec(cmd, options) {
        return new Promise((resolve, reject) => {
            console.log('cmd ++=>', cmd);
            (0, child_process_1.exec)(cmd, options, (error, stdout, stderr) => {
                if (stderr.length > 0) {
                    console.log('stderr ++=>', stderr);
                }
                resolve({
                    stdout: stdout,
                    stderr: stderr,
                    error: error
                });
            });
        });
    }
    /**
     * elevate
     * @param cmd 要执行的命令
     * @param options 选项配置
     * @returns
     */
    elevate_exec(cmd, options) {
        return this.cmd_exec('"' + bin_1.default.getElevate() + '" ' + cmd, options);
    }
    /**
     * 是否管理权限
     * @returns
     */
    async isAdmin() {
        return new Promise((resolve, reject) => {
            this.cmd_exec('NET SESSION', {}).then(data => {
                if (data.stderr.length > 0) {
                    this.elevate_exec('NET SESSION', {}).then(data => {
                        if (data.stderr.length > 0) {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    }).catch(err => {
                        resolve(false);
                    });
                }
                else {
                    resolve(true);
                }
            }).catch(err => {
                resolve(false);
            });
        });
    }
}
exports.default = new WinCmd();
//# sourceMappingURL=WinCmd.js.map