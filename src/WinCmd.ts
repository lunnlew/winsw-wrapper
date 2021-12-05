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
            console.log('cmd ++=>', cmd);
            exec(cmd, options, (error, stdout, stderr) => {
                if (stderr.length > 0) {
                    console.log('stderr ++=>', stderr);
                }
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
    }> {
        return this.cmd_exec('"' + bin.getElevate() + '" ' + cmd, options);
    }
    /**
     * 是否管理权限
     * @returns 
     */
    async isAdmin(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.cmd_exec('NET SESSION', {}).then(data => {
                if (data.stderr.length > 0) {
                    this.elevate_exec('NET SESSION', {}).then(data => {
                        if (data.stderr.length > 0) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }).catch(err => {
                        resolve(false);
                    })
                } else {
                    resolve(true)
                }
            }).catch(err => {
                resolve(false);
            })
        })
    }
}

export default new WinCmd();