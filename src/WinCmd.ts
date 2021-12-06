import { exec } from "child_process";
import bin from './bin';

class WinCmd {
    /**
     * exec
     * @param cmd 要执行的命令
     * @param options 选项配置
     * @returns 
     */
    cmd_exec(cmd: string, options: {}): Promise<{
        stdout: string;
        stderr: string;
        error: Error;
    }> {
        return new Promise((resolve, reject) => {
            exec(cmd, options, (error, stdout, stderr) => {
                resolve({
                    stdout: stdout,
                    stderr: stderr,
                    error: error
                })
            })
        });
    }
    /**
     * powershell
     * @param cmd 要执行的命令
     * @param options 选项配置
     * @returns 
     */
    powershell_exec(cmd: string, options: {}): Promise<{
        stdout: string;
        stderr: string;
        error: Error;
    }> {
        return new Promise((resolve, reject) => {
            exec(`${bin.getPowershell()} -Command "${cmd}"`, options, (error, stdout, stderr) => {
                resolve({
                    stdout: stdout,
                    stderr: stderr,
                    error: error
                })
            })
        });
    }
    /**
     * elevate
     * @param cmd 要执行的命令
     * @param options 选项配置
     * @returns 
     */
    elevate_exec(cmd: string, options: {}): Promise<{
        stdout: string;
        stderr: string;
        error: Error;
    }> {
        return this.powershell_exec('"' + bin.getElevate() + '" ' + cmd, options);
    }
}

export default new WinCmd();