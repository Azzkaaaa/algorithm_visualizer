type StackVisualizerProps = {
    name: string;
    values: unknown[];
    previousValues?: unknown[];
};

export default function StackVisualizer({
    name,
    values,
    previousValues = [],
}: StackVisualizerProps) {
    let operation = "No change";

    if (values.length > previousValues.length) {
        operation = "Push";
    } else if (
        values.length < previousValues.length
    ) {
        operation = "Pop";
    } else if (
        JSON.stringify(values) !==
        JSON.stringify(previousValues)
    ) {
        operation = "Update";
    }

    const reversedValues = values
        .map((value, index) => ({
        value,
        originalIndex: index,
        }))
        .reverse();

    return (
        <div className="rounded-lg bg-zinc-950 p-3">
            <div className="mb-3 flex items-center justify-between">
                <div className="font-mono text-blue-300">
                {name}
                </div>

                <div className="rounded bg-zinc-900 px-2 py-1 text-xs text-zinc-400">
                {operation}
                </div>
            </div>

            {values.length === 0 ? (
                <p className="text-sm text-zinc-500">
                Empty stack
                </p>
            ) : (
                <div className="flex flex-col items-center">
                    {reversedValues.map(
                        ({ value, originalIndex }) => {
                            const isTop =
                                originalIndex === values.length - 1;

                            const hasChanged =
                                JSON.stringify(
                                previousValues[originalIndex],
                                ) !== JSON.stringify(value);

                            let stateClass =
                                "border-zinc-700 bg-zinc-900";

                            if (hasChanged) {
                                stateClass =
                                "border-emerald-500 bg-emerald-500/10 text-emerald-200";
                            }

                            if (isTop) {
                                stateClass =
                                "border-yellow-400 bg-yellow-500/20 text-yellow-200";
                            }

                            return (
                                <div
                                key={originalIndex}
                                className="flex items-center gap-3"
                                >
                                    <div
                                        className={`min-w-32 border px-4 py-2 text-center font-mono ${stateClass}`}
                                    >
                                        {formatValue(value)}
                                    </div>

                                    <div className="w-10 text-xs text-yellow-300">
                                        {isTop ? "top" : ""}
                                    </div>
                                </div>
                            );
                        },
                    )}

                    <div className="mt-1 h-1 w-36 bg-zinc-700" />
                </div>
            )}
        </div>
    );
}

function formatValue(value: unknown): string {
    if (typeof value === "string") {
        return `"${value}"`;
    }

    if (value === undefined) {
        return "undefined";
    }

    return JSON.stringify(value) ?? String(value);
}