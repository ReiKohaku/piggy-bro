import SqliteTemplate from "./SqliteTemplate"

export default class CallLimiter {
    private readonly databaseTemplate: SqliteTemplate

    /**
     * This constructor has a async create table call.
     * So, please, create this class as early as possible.
     * @param databaseTemplate
     */
    constructor(databaseTemplate: SqliteTemplate) {
        this.databaseTemplate = databaseTemplate
        const sql = "CREATE TABLE IF NOT EXISTS call_limit (" +
            "identify_id VARCHAR(64) NOT NULL," +
            "method      VARCHAR(64) NOT NULL," +
            "call_time   LONG        NOT NULL" +
            ")"
        this.databaseTemplate.run(sql).catch(console.error)
    }

    /**
     * Check is method reach call limit or not.
     * Default "checkSection" argument is from 00:00:00AM today to 23:59:59 today
     */
    public async check(identifyId: string, method: string, checkSectionMin?: Date, checkSectionMax?: Date): Promise<number> {
        const today = new Date()
        if (!checkSectionMin)
            checkSectionMin = new Date(`${today.toDateString()} 00:00:00`)
        if (!checkSectionMax)
            checkSectionMax = new Date(`${today.toDateString()} 23:59:59`)
        interface Result {
            'COUNT(*)': number
        }
        try {
            const sql = "SELECT COUNT(*) FROM call_limit WHERE identify_id = ? AND method = ? AND call_time > ? AND call_time < ?"
            const result = await this.databaseTemplate.get<Result>(sql, identifyId, method, checkSectionMin.getTime(), checkSectionMax.getTime())
            return result["COUNT(*)"]
        } catch (e) {
            console.error(e)
            throw new Error("ERR_CHECK_CALL_LIMIT_FAILED")
        }
    }

    public async record(identifyId: string, method: string): Promise<number> {
        try {
            const sql = "INSERT INTO call_limit (identify_id, method, call_time) VALUES (?, ?, ?)"
            const result = await this.databaseTemplate.run(sql, identifyId, method, new Date().getTime())
            return result.changes
        } catch (e) {
            console.error(e)
            throw new Error("ERR_INSERT_CALL_LIMIT_RECORD_FAILED")
        }
    }
}
