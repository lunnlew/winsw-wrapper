import EventEmitter from 'events';
/**
 * 服务安装时使用的域账号信息
 */
export interface ServiceAccount {
    /**
     * 账号域
     */
    domain?: string;
    /**
     * 账号名
     */
    user?: string;
    /**
     * 账号密码
    */
    password?: string;
    /**
     * 是否允许服务登录
     */
    allowservicelogon?: boolean;
}
const Priority = [
    'Normal',
    'Idle',
    'High',
    'RealTime',
    'BelowNormal',
    'AboveNormal'
] as const

export type PriorityType = typeof Priority[number]

const Startmode = [
    'Automatic',
    'Manual',
    'Boot',
    'System'
] as const

export type StartmodeType = typeof Startmode[number]

const Logmode = [
    'none',
    'append',
    'reset',
    'roll',
    'roll-by-size',
    'roll-by-time',
    'roll-by-size-time',
    'rotate'
] as const

export type LogmodeType = typeof Logmode[number]

export interface WinswWrapperOptions {
    // 必须的属性
    /**
     * 服务的ID
     */
    id: string;
    /**
     *  服务的显示名称
     */
    name: string;
    /**
     *  服务的描述
     */
    description: string;
    /**
     *  服务的可执行文件路径
     */
    executable: string;

    // 可选的属性
    /**
     * 服务安装时使用的域账号信息
     */
    serviceaccount?: ServiceAccount
    /**
     * 服务执行失败后的重试动作
     */
    onfailure?: {
        action: string;
        delay?: string = '10 sec'
    };
    /**
     * 服务失败后再次重置状态的时间间隔
     */
    resetfailure?: string = '1 hour'
    /**
     * 执行的参数
     */
    arguments?: array[string];
    /**
     * start时执行的参数，运行时会覆盖arguments指定的参数
     */
    startarguments?: array[string];
    /**
     * 工作目录
     */
    workdir?: string = '';
    /**
     * 服务的优先级
     */
    priority?: PriorityType;
    /**
     * 服务停止的超时时间，之后将强制停止
     */
    stoptimeout?: string = '15 sec';
    /**
     * 是否是先停止父进程
     */
    stopparenfirst?: boolean = true;
    /**
     * 用于停止服务时执行的可执行文件，仅在指定了停止参数时有效
     */
    stopexecutable?: string;
    /**
     * 停止服务时执行的参数
     */
    stoparguments?: array[string];
    /**
     * 服务启动模式
     */
    startmode?: StartmodeType;
    /**
     * 自动启动模式时延迟启动
     */
    delayedautostart?: boolean = false;
    /**
     * 服务环境变量
     */
    env?: Object
    /**
     * 依赖服务
     */
    depend?: string[]
    /**
     * 服务日志文件路径
     */
    logpath?: string
    /**
     * 服务日志模式
     */
    logmode?: LogmodeType
    /**
     * 日志模式的配置参数
     */
    logmodeOptions?: Object
}
export default class WinswWrapper extends EventEmitter {
    /**
     * WinswWrapperOptions
     */
    options: WinswWrapperOptions;

    /**
     * 生成的wrapper保存位置
     */
    wrapperSaveDir: string;

    /**
     * @param options 
     */
    constructor(options: WinswWrapperOptions): this;

    /**
     * @param event keyof ServiceEvents
     * @param listener 
     */
    on<T extends WinswEventType>(event: T, listener: (data: Payload<T>) => void): this;

    /**
     * @param event keyof ServiceEvents
     * @param listener 
     */
    once<T extends WinswEventType>(event: T, listener: (data: Payload<T>) => void): this;

    /**
     * @param event keyof ServiceEvents
     * @param listener 
     */
    off<T extends WinswEventType>(event: T, listener: (data: Payload<T>) => void): this;

    /**
     * @param event keyof ServiceEvents
     * @param args 
     */
    emit<T extends WinswEventType>(
        event: T, ...args: Parameters<(data: Payload<T>) => void>
    ): boolean;

    /**
     * 启动服务
     */
    start(): WinswWrapper;

    /**
     * 停止服务
     */
    stop(): WinswWrapper;

    /**
     * 安装服务
     */
    install(): WinswWrapper;

    /**
     * 卸载服务
     */
    uninstall(): WinswWrapper;

    /**
     * 重启服务
     */
    restart(): WinswWrapper;

    /**
     * 查看服务状态
     */
    status(): WinswWrapper;

    /**
     * 测试服务在停止状态时能否启动
     */
    test(): WinswWrapper;

    /**
     * 设置配置生成时的Wrapper放置目录
     * @param dirPath 
     */
    setWrapperSaveDir(dirPath: string): WinswWrapper;

    /**
     * 设置使用的winsw bin文件所在目录
     * @param binPath 
     */
    setWrapperBinPath(binPath: string): WinswWrapper;

    /**
     * 设置服务安装时使用的用户域账号
     * @param serviceAccount
     */
    setServiceAccount(serviceAccount: ServiceAccount): WinswWrapper;

    /**
     * 服务失败后可以执行的动作
     * @param action
     * @param delay
     */
    afterFailure(action: 'restart' | 'reboot', delay = '10 sec'): WinswWrapper;

    /**
     * 服务失败后再次重置状态的时间间隔
     * @param delay 
     * @returns 
     */
    resetFailure(delay = '1 hour'): WinswWrapper;

    /**
     * 执行的参数
     * @param arg
     */
    arguments(arg = ''): WinswWrapper;

    /**
     * start时执行的参数，运行时会覆盖arguments指定的参数
     * @param arg
     */
    startarguments(arg = ''): WinswWrapper;

    /**
     * 执行时的工作目录
     * @param path 
     * @returns 
     */
    workdir(path = ''): WinswWrapper;

    /**
    * 服务的优先级
    * @param priority 
    * @returns 
    */
    priority(priority: PriorityType): WinswWrapper;

    /**
     * 停止后的超时时间，之后将强制停止
     * @param timeout 
     * @returns 
     */
    stoptimeout(timeout = '15 sec'): WinswWrapper;

    /**
    * 是否首先停止父进程
    * @param enable 
    * @returns 
    */
    stopparenfirst(enable = true): WinswWrapper;

    /**
     * 用于停止服务时执行的可执行文件，仅在指定了停止参数时有效
     * @param path 
     * @returns 
     */
    stopexecutable(path = ''): WinswWrapper;

    /**
     * 用于停止服务时执行的可执行文件的参数
     * @param arg
     */
    stoparguments(arg = ''): WinswWrapper;

    /**
     * 服务启动模式
     * @param mode 
     * @returns 
     */
    startmode(mode: StartmodeType = 'Automatic'): WinswWrapper;

    /**
     * 服务启动时的等待时间
     * @param enable 
     * @returns 
     */
    delayedAutoStart(enable: boolean = false): WinswWrapper;

    /**
     * 设置服务的环境变量
     * @param key 
     * @param value 
     * @returns 
     */
    env(key: string, value: any): WinswWrapper;

    /**
     * 运行依赖的服务名称
     * @param service 
     * @returns 
     */
    depend(service: string): WinswWrapper;

    /**
     * 设置服务日志的路径
     * @param path 
     */
    logpath(path = ''): WinswWrapper;

    /**
     * 设置服务日志新增模式
     * @param mode 
     * @param options 
     */
    logmode(mode: LogmodeType = 'append', options?: any): WinswWrapper;
}
type WinswEventStateType = 'error' | 'success'

type WinswEventPayload = {
    /**
     * 事件结果状态
     */
    state: WinswEventStateType,
    /**
     * 关联事件名称，仅在state为error时有效
     */
    event?: WinswEventType,
    /**
     * 事件结果数据
     */
    data?: any
}
interface WinswEventMap {
    install: WinswEventPayload;
    uninstall: WinswEventPayload;
    start: WinswEventPayload;
    stop: WinswEventPayload;
    restart: WinswEventPayload;
    status: WinswEventPayload;
    test: WinswEventPayload;
    error: WinswEventPayload
}
export type WinswEventType = keyof WinswEventMap;
type Payload<T extends WinswEventType> = WinswEventMap[T];