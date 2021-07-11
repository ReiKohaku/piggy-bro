interface EventMap {
    'start'(...args: unknown[]): any | Promise<any>

    'answer'(answer: { content: string, userId: string, userName: string }): boolean | void | Promise<boolean | void>

    'end'(...args: unknown[]): any | Promise<any>
}

type EventName = keyof EventMap

export default class IdiomGame<T> {
    private $score: Record<string, { score: number, name: string }>
    private $stack: T[]
    private $timer: NodeJS.Timeout
    private timerStartAt: number
    private $status: "idle" | "starting" | "start" | "pause" | "ending"
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
        this.$score = {}
        this.$stack = []
        this.$status = "idle"
    }

    public get status() {
        return this.$status
    }

    public lastIdiom(): T {
        return this.$stack[this.$stack.length - 1]
    }

    public getScore(id: string): number | null {
        if (this.$score[id] && typeof this.$score[id] === "number")
            return this.$score[id].score
        return null
    }

    public getAllScore(): Record<string, { name: string, score: number }> {
        return this.$score
    }

    public addScore(id: string, name: string, score: number = 1) {
        if (!this.$score[id]) this.$score[id] = {name, score}
        else this.$score[id].score += score
    }

    public push(idiom: T) {
        this.$stack.push(idiom)
    }

    public startTimer(timeout: number = 30000) {
        this.$timer = setTimeout(async () => {
            if (this.$status === "start") await this.end()
        }, timeout)
        this.timerStartAt = new Date().getTime()
    }

    public stopTimer() {
        clearTimeout(this.$timer)
    }

    public resetTimer() {
        if (this.$timer) {
            this.$timer.refresh()
            this.timerStartAt = new Date().getTime()
        }
    }

    public on<K extends EventName>(event: K, listener: EventMap[K]) {
        this.events[event] = listener
    }

    public async start() {
        if (this.$status !== "idle") return
        this.$status = "starting"
        this.events.start()
        this.$status = "start"
    }

    public pause() {
        if (this.$status !== "start") return
        this.$status = "pause"
    }

    public continue() {
        if (this.$status !== "pause") return
        this.$status = "start"
    }

    public async answer(answer: { content: string, userId: string, userName: string }) {
        if (this.$status !== "start") return
        return this.events.answer(answer);
    }

    public async end(...args: any[]) {
        if (this.$status !== "start" && this.$status !== "pause") return
        this.$status = "ending"
        this.events.end(...args)
        this.$score = {}
        this.$stack = []
        this.$status = "idle"
    }
}
