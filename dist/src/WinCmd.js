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
            (0, child_process_1.exec)(cmd, options, (error, stdout, stderr) => {
                resolve({
                    stdout: stdout,
                    stderr: stderr,
                    error: error
                });
            });
        });
    }
    /**
     * powershell
     * @param cmd 要执行的命令
     * @param options 选项配置
     * @returns
     */
    powershell_exec(cmd, options) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`${bin_1.default.getPowershell()} -Command "${cmd}"`, options, (error, stdout, stderr) => {
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
        return this.powershell_exec('"' + bin_1.default.getElevate() + '" ' + cmd, options);
    }
}
exports.default = new WinCmd();
//# sourceMappingURL=WinCmd.js.map