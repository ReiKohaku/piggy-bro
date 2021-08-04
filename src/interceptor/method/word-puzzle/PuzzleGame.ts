interface EventMap {
    'start'(...args: unknown[]): any | Promise<any>

    'answer'(answer: { content: string, userId: string, userName: string }): boolean | void | Promise<boolean | void>

    'end'(...args: unknown[]): any | Promise<any>
}

type EventName = keyof EventMap

export default class PuzzleGame<T> {
    private $timer: NodeJS.Timeout
    private $status: "idle" | "starting" | "start" | "pause" | "ending"
    private $data: T
    private events: EventMap = {
        start(): void {
            return
        },
        answer(answer: { content: string; userId: string, userName: string }): boolean | void {
            console.log(`${answer.userName}：${answer.content}`)
            return void 0
        },
        end: () => {
            this.stopTimer()
            return void 0
        }
    }

    constructor() {
        this.$status = "idle"
    }

    public async start(timeout: number = 30000) {
        if (this.$status !== "idle") return
        this.$status = "starting"
        await this.events.start()
        this.startTimer(timeout)
        this.$status = "start"
    }

    public async answer(answer: { content: string, userId: string, userName: string }) {
        if (this.$status !== "start") return
        return this.events.answer(answer);
    }

    public async end(...args: any[]) {
        if (this.$status !== "start" && this.$status !== "pause") return
        this.$status = "ending"
        this.stopTimer()
        await this.events.end(...args)
        this.$status = "idle"
    }

    public startTimer(timeout: number = 30000) {
        if (!this.$timer) {
            this.$timer = setTimeout(() => {
                void this.end()
            }, timeout)
        }
    }

    public stopTimer() {
        if (this.$timer) {
            clearTimeout(this.$timer)
            this.$timer = null
        }
    }

    public get status(): string {
        return this.$status
    }

    public on<K extends EventName>(event: K, listener: EventMap[K]) {
        this.events[event] = listener
    }

    public set data(data: T) {
        this.$data = data
    }

    public get data(): T {
        return this.$data
    }
}
