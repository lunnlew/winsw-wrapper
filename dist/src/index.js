"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const xml_1 = (0, tslib_1.__importDefault)(require("xml"));
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const bin_1 = (0, tslib_1.__importDefault)(require("./bin"));
const WinCmd_1 = (0, tslib_1.__importDefault)(require("./WinCmd"));
const events_1 = (0, tslib_1.__importDefault)(require("events"));
const defaultOptions = {
    id: "hello world",
    name: "Hello World Service",
    description: "A simple service",
    executable: "",
};
/**
 * winsw服务包装器
 */
class WinswWrapper extends events_1.default {
    options;
    constructor(options = defaultOptions) {
        super();
        this.options = Object.assign({}, defaultOptions, options);
    }
    /**
     * 组合xml配置
     * @returns {Object}
     */
    buildXmlOptions() {
        if (!this.options.id) {
            throw new Error("id is required");
        }
        if (!this.options.name) {
            throw new Error("name is required");
        }
        const _xml = [
            {
                id: this.options.id,
            },
            {
                name: this.options.name,
            },
            {
                description: this.options.description,
            },
        ];
        if (!this.options.executable) {
            throw new Error("executable is required");
        }
        else {
            _xml.push({
                executable: this.options.executable,
            });
        }
        if (this.options.serviceaccount) {
            var serviceaccount = [
                { domain: this.options.serviceaccount.domain || "" },
                { user: this.options.serviceaccount.user || "" },
                { password: this.options.serviceaccount.password || "" },
                {
                    allowservicelogon: this.options.serviceaccount.allowservicelogon || false,
                },
            ];
            _xml.push({
                serviceaccount: serviceaccount,
            });
        }
        if (this.options.onfailure) {
            _xml.push({
                onfailure: {
                    _attr: {
                        action: this.options.onfailure.action,
                        delay: this.options.onfailure.delay,
                    },
                },
            });
        }
        if (this.options.resetfailure) {
            _xml.push({
                resetfailure: this.options.resetfailure,
            });
        }
        if (this.options.arguments && this.options.arguments.length > 0) {
            _xml.push({
                arguments: this.options.arguments.join(" "),
            });
        }
        if (this.options.startarguments && this.options.startarguments.length > 0) {
            _xml.push({
                startarguments: this.options.startarguments.join(" "),
            });
        }
        if (this.options.workdir) {
            _xml.push({
                workingdirectory: this.options.workdir,
            });
        }
        if (this.options.priority) {
            _xml.push({
                priority: this.options.priority,
            });
        }
        if (this.options.stoptimeout) {
            _xml.push({
                stoptimeout: this.options.stoptimeout,
            });
        }
        if (this.options.stopparenfirst) {
            _xml.push({
                stopparentprocessfirst: this.options.stopparenfirst,
            });
        }
        if (this.options.stoparguments && this.options.stoparguments.length > 0) {
            _xml.push({
                stoparguments: this.options.stoparguments.join(" "),
            });
            if (this.options.stopexecutable) {
                _xml.push({
                    stopexecutable: this.options.stopexecutable,
                });
            }
        }
        if (this.options.startmode) {
            _xml.push({
                startmode: this.options.startmode,
            });
        }
        if (this.options.delayedautostart) {
            _xml.push({
                delayedautostart: this.options.delayedautostart,
            });
        }
        if (this.options.env) {
            for (let name in this.options.env) {
                _xml.push({
                    env: {
                        _attr: { name: name, value: this.options.env[name] },
                    },
                });
            }
        }
        if (this.options.depend && this.options.depend.length > 0) {
            for (let depend of this.options.depend) {
                _xml.push({
                    depend: depend,
                });
            }
        }
        if (this.options.logpath) {
            _xml.push({
                logpath: this.options.logpath,
            });
        }
        if (this.options.logmode) {
            let _xml_logmode = {
                log: [
                    {
                        _attr: { mode: this.options.logmode },
                    },
                ],
            };
            if (this.options.logmodeOptions) {
                for (let name in this.options.logmodeOptions) {
                    _xml_logmode.log.push({
                        [name]: this.options.logmodeOptions[name],
                    });
                }
            }
            _xml.push(_xml_logmode);
        }
        return _xml;
    }
    /**
     * 生成xml配置
     */
    generateXml(root, xmlOptions) {
        return (0, xml_1.default)({ [root]: xmlOptions }, { declaration: true, indent: "\t" }).replace(/\n/g, "\r\n");
    }
    /**
     * 取得Wrapper放置目录
     */
    getWrapperExeDir() {
        return __dirname + "/";
    }
    /**
     * 取得Wrapper名称
     */
    getWrapperExeName() {
        const { id } = this.options;
        return id.replace(/[^\w]/gi, "").toLowerCase();
    }
    /**
     * 取得Wrapper文件路径
     */
    getWrapperExePath() {
        return (this.getWrapperExeDir() +
            this.getWrapperExeName() +
            ".exe").replace(/\\/g, "/");
    }
    /**
     * 创建Wrapper文件
     */
    createWrapperExe() {
        const winsw_path = bin_1.default.getWinsw();
        if (!fs_1.default.existsSync(winsw_path)) {
            throw new Error("winsw.exe not exists: " + winsw_path);
        }
        const exe_path = this.getWrapperExePath();
        const source_files = [winsw_path, winsw_path + ".config"];
        const dest_files = [exe_path, exe_path + ".config"];
        for (let i = 0; i < source_files.length; i++) {
            const source_file = source_files[i];
            const dest_file = dest_files[i];
            fs_1.default.copyFileSync(source_file, dest_file);
        }
    }
    /**
     * 设置winsw bin文件所在目录
     * @param path
     * @returns
     */
    setWrapperBinPath(path) {
        bin_1.default.setWrapperBinPath(path);
        return this;
    }
    /**
     * 设置服务安装时使用的用户域账号
     * @param account
     * @returns
     */
    setServiceAccount(account) {
        this.options.serviceaccount = account;
        return this;
    }
    /**
     * 服务失败后可以执行的动作
     * @param action
     * @returns
     */
    afterFailure(action, delay = "10 sec") {
        this.options.onfailure = {
            action,
            delay,
        };
        return this;
    }
    /**
     * 服务失败后再次重置状态的时间间隔
     * @param delay
     * @returns
     */
    resetFailure(delay = "1 hour") {
        this.options.resetfailure = delay;
        return this;
    }
    /**
     * 执行的参数
     */
    arguments(arg = "") {
        this.options.arguments = this.options.arguments || [];
        this.options.arguments.push(arg);
        return this;
    }
    /**
     * start时执行的参数，运行时会覆盖arguments指定的参数
     */
    startarguments(arg = "") {
        this.options.startarguments = this.options.startarguments || [];
        this.options.startarguments.push(arg);
        return this;
    }
    /**
     * 执行时的工作目录
     * @param path
     * @returns
     */
    workdir(path = "") {
        this.options.workdir = path;
        return this;
    }
    /**
     * 服务的优先级
     * @param priority
     * @returns
     */
    priority(priority) {
        this.options.priority = priority || "Normal";
        return this;
    }
    /**
     * 停止后的超时时间，之后将强制停止
     * @param timeout
     * @returns
     */
    stoptimeout(timeout = "15 sec") {
        this.options.stoptimeout = timeout;
        return this;
    }
    /**
     * 是否首先停止父进程
     * @param enable
     * @returns
     */
    stopparenfirst(enable = true) {
        this.options.stopparenfirst = enable;
        return this;
    }
    /**
     * 用于停止服务时执行的可执行文件，仅在指定了停止参数时有效
     * @param path
     * @returns
     */
    stopexecutable(path = "") {
        this.options.stopexecutable = path;
        return this;
    }
    /**
     * 用于停止服务时执行的可执行文件的参数
     */
    stoparguments(arg = "") {
        this.options.stoparguments = this.options.stoparguments || [];
        this.options.stoparguments.push(arg);
        return this;
    }
    /**
     * 服务启动模式
     * @param mode
     * @returns
     */
    startmode(mode = "Automatic") {
        this.options.startmode = mode;
        return this;
    }
    /**
     * 服务启动时的等待时间
     * @param delay
     * @returns
     */
    delayedAutoStart(delay = "1 sec") {
        this.options.delayedautostart = delay;
        return this;
    }
    /**
     * 设置服务的环境变量
     * @param key
     * @param value
     * @returns
     */
    env(key, value) {
        this.options.env = this.options.env || {};
        this.options.env[key] = value;
        return this;
    }
    /**
     * 运行依赖的服务名称
     * @param service
     * @returns
     */
    depend(service) {
        this.options.depend = this.options.depend || [];
        this.options.depend.push(service);
        return this;
    }
    /**
     * 设置服务日志的路径
     */
    logpath(path = "") {
        this.options.logpath = path;
        return this;
    }
    /**
     * 设置服务日志新增模式
     * @param mode
     * @param options see https://github.com/winsw/winsw/blob/master/doc/loggingAndErrorReporting.md
     */
    logmode(mode = "append", options) {
        this.options.logmode = mode;
        this.options.logmodeOptions = options;
        return this;
    }
    /**
     * 服务安装
     * @returns
     */
    install() {
        this.run("install");
        return this;
    }
    /**
     * 服务卸载
     * @returns
     */
    uninstall() {
        this.run("uninstall");
        return this;
    }
    /**
     * 服务启动
     * @returns
     */
    start() {
        this.run("start");
        return this;
    }
    /**
     * 服务停止
     * @returns
     */
    stop() {
        this.run("stop");
        return this;
    }
    /**
     * 重启服务
     * @returns
     */
    restart() {
        this.run("restart");
        return this;
    }
    /**
     * 查看服务状态
     * @returns
     */
    status() {
        this.run("status");
        return this;
    }
    /**
     * 测试服务在停止状态时能否启动
     * @returns
     */
    test() {
        this.run("test");
        return this;
    }
    /**
     * 处理返回的结果
     * @param action
     */
    buildExeResult(action, data) {
        const { stdout, stderr, error } = data;
        if (stderr.length > 0) {
            this.emit(action, {
                state: "error",
                error: stderr.toString(),
            });
            this.emit("error", stderr.toString());
        }
        else {
            switch (action) {
                case "install":
                    if (stdout.toString().indexOf("already exists") > -1) {
                        this.emit(action, {
                            state: "error",
                            data: "Existent",
                        });
                    }
                    else {
                        this.emit(action, {
                            state: "success",
                            data: stdout.toString(),
                        });
                    }
                    break;
                case "uninstall":
                    if (stdout.toString().indexOf("does not exist") > -1) {
                        this.emit(action, {
                            state: "error",
                            data: "NonExistent",
                        });
                    }
                    else {
                        this.emit(action, {
                            state: "success",
                            data: stdout.toString(),
                        });
                    }
                    break;
                case "status":
                    if (stdout.toString().indexOf("NonExistent") > -1) {
                        this.emit(action, {
                            state: "error",
                            data: "NonExistent",
                        });
                    }
                    else if (stdout.toString().indexOf("Stopped") > -1) {
                        this.emit(action, {
                            state: "success",
                            data: "Stopped",
                        });
                    }
                    else if (stdout.toString().indexOf("Started") > -1) {
                        this.emit(action, {
                            state: "success",
                            data: "Started",
                        });
                    }
                    else {
                        this.emit(action, {
                            state: "success",
                            data: stdout.toString(),
                        });
                    }
                    break;
                default:
                    this.emit(action, {
                        state: "success",
                        data: stdout.toString(),
                    });
                    break;
            }
        }
    }
    /**
     * 运行服务命令
     * @param action
     */
    run(action) {
        const cmd = `${this.getWrapperExePath()} ${action}`;
        let xml_path = path_1.default.join(__dirname, this.getWrapperExeName() + ".xml");
        let wrapper_path = path_1.default.join(__dirname, this.getWrapperExeName() + ".exe");
        // 始终进行xml配置生成
        const xml = this.generateXml("service", this.buildXmlOptions());
        fs_1.default.writeFileSync(xml_path, xml);
        // 不存在WrapperExe时重新生成
        if (!fs_1.default.existsSync(wrapper_path)) {
            this.createWrapperExe();
        }
        WinCmd_1.default.elevate_exec(cmd, {})
            .then((data) => this.buildExeResult(action, data))
            .catch(err => {
            this.emit('error', `${action} failed: ${err}`);
        });
    }
}
exports.default = WinswWrapper;
