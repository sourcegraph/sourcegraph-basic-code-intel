import * as sourcegraph from 'sourcegraph'

/**
 * A wrapper around telemetry events. A new instance of this class
 * should be instantiated at the start of each action as it handles
 * latency tracking.
 */
export class TelemetryEmitter {
    private languageID: string
    private started: number
    private enabled: boolean
    private emitted = new Set<string>()

    constructor(languageID: string, enabled = true) {
        this.languageID = languageID
        this.started = Date.now()
        this.enabled = enabled
    }

    /**
     * Emit a telemetry event with a durationMs attribute only if the
     * same action has not yet emitted for this instance.
     */
    public emitOnce(action: string, args: object = {}): Promise<void> {
        if (this.emitted.has(action)) {
            return Promise.resolve()
        }

        this.emitted.add(action)
        return this.emit(action, args)
    }

    /**
     * Emit a telemetry event with durationMs and languageId attributes.
     */
    public async emit(action: string, args: object = {}): Promise<void> {
        if (!this.enabled) {
            return
        }

        try {
            await sourcegraph.commands.executeCommand('logTelemetryEvent', `codeintel.${action}`, {
                ...args,
                durationMs: this.elapsed(),
                languageId: this.languageID,
            })
        } catch {
            // Older version of Sourcegraph may have not registered this
            // command, causing the promise to reject. We can safely ignore
            // this condition.
        }
    }

    private elapsed(): number {
        return Date.now() - this.started
    }
}
