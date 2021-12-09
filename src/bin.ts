import path from "path";

class bin {
    binPath: string;
    /**
     * 设置bin目录
     * @param binPath 
     */
    setWrapperBinPath(binPath: string) {
        this.binPath = binPath.replace(/\\/g, "/");
    }
    /**
     * 获取bin目录
     * @returns 
     */
    getWrapperBinPath() {
        return (this.binPath || path.resolve(__dirname, '../../bin')).replace(/\\/g, "/");
    }
    /**
     * 获取elevate.cmd的路径
     * @returns 
     */
    getElevate() {
        return this.getWrapperBinPath() + "/elevate/elevate.ps1";
    }
    /**
     * 获取winsw.exe的路径
     * @returns 
     */
    getWinsw() {
        return this.getWrapperBinPath() + "/winsw/WinSW.NET2.exe";
    }
    /**
     * 获取powershell.exe的路径
     * @returns 
     */
    getPowershell() {
        return "powershell.exe";
    }
}
export default new bin();