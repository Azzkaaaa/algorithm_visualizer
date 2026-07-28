import type { CallStackFrame } from "@/types/trace";

type CallStackVisualizerProps = {
    frames: CallStackFrame[];
}

export default function CallStackVisualizer({
    frames,
}: CallStackVisualizerProps) {
    if (frames.length === 0) {
        return null;
    }
    
    return (
        <div className="mb-4 rounded-lg bg-zinc-950 p-3">
            <div className="mb-3 font-semibold">
                Call Stack
            </div>

            <div className="space-y-2">
                {frames.map((frame, index) => {
                    const isActive =
                        index === frames.length - 1;

                    return (
                        <div
                        key={`${frame.function}-${index}`}
                        className={`rounded-lg border p-3 ${
                            isActive
                            ? "border-yellow-400 bg-yellow-500/10"
                            : "border-zinc-800 bg-zinc-900"
                        }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="font-mono text-blue-300">
                                    {frame.function}()
                                </span>

                                <span className="text-xs text-zinc-500">
                                    line {frame.line}
                                </span>
                            </div>

                            <div className="mt-2 text-xs text-zinc-400">
                                {formatLocals(frame.locals)}
                            </div>

                            {isActive && (
                                <div className="mt-2 text-xs text-yellow-300">
                                    active frame
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function formatLocals(locals: Record<string, unknown>): string {
    const entries = Object.entries(locals);

    if (entries.length === 0) {
        return "No local variables";
    }

    return entries
        .map(([key, value]) => {
            const serialized = JSON.stringify(value) ?? String(value);

            return `${key}: ${serialized}`;
        })
        .join(", ");
}