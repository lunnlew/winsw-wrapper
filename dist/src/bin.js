"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
class bin {
    binPath;
    /**
     * 设置bin目录
     * @param binPath
     */
    setWrapperBinPath(binPath) {
        this.binPath = binPath.replace(/\\/g, "/");
    }
    /**
     * 获取bin目录
     * @returns
     */
    getWrapperBinPath() {
        return (this.binPath || path_1.default.resolve(__dirname, '../../bin')).replace(/\\/g, "/");
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
        return this.getWrapperBinPath() + "/winsw/winsw.exe";
    }
    /**
     * 获取powershell.exe的路径
     * @returns
     */
    getPowershell() {
        return "powershell.exe";
    }
}
exports.default = new bin();
//# sourceMappingURL=bin.js.map