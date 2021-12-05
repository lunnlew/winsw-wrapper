/**
 * 服务安装时使用的域账号信息
 */
interface ServiceAccount {
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

type PriorityType = typeof Priority[number]

const Startmode = [
    'Automatic',
    'Manual',
    'Boot',
    'System'
] as const

type StartmodeType = typeof Startmode[number]

const Logmode = [
    'append',
    'none',
    'reset',
    'roll',
    'roll-by-time',
    'rotate'
] as const

type LogmodeType = typeof Logmode[number]

interface WinswWrapperOptions {
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
     * 服务启动时的等待时间
     */
    delayedautostart?: string = '1 sec';
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
    logmode?: LogmodeType
}


interface ServiceEvents {
    /**
     * 服务安装后触发
     */
    'install': () => void;
    /**
     * 服务卸载后触发
     */
    'uninstall': () => void;
    /**
     * 服务启动后触发
     */
    'start': () => void;
    /**
     * 服务停止后触发
     */
    'stop': () => void;
    /**
     *服务出错后触发
     */
    'error': (err: Error | string) => void;
}