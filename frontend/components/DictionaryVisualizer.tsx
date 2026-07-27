type DictionaryVisualizerProps = {
    name: string;
    value: Record<string, unknown>;
    previousValue?: Record<string, unknown>;
};

export default function DictionaryVisualizer({
    name,
    value,
    previousValue = {},
}: DictionaryVisualizerProps) {
    const keys = Array.from(
        new Set([
        ...Object.keys(previousValue),
        ...Object.keys(value),
        ]),
    );

    return (
        <div className="rounded-lg bg-zinc-950 p-3">
            <div className="mb-3 font-mono text-blue-300">
                {name}
            </div>

            {keys.length === 0 ? (
                <p className="text-sm text-zinc-500">
                Empty dictionary
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                        <tr className="text-left text-zinc-500">
                            <th className="border-b border-zinc-800 px-3 py-2">
                            Key
                            </th>

                            <th className="border-b border-zinc-800 px-3 py-2">
                            Value
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {keys.map((key) => {
                            const existsNow = key in value;
                            const existedBefore =
                            key in previousValue;

                            const hasChanged =
                            JSON.stringify(previousValue[key]) !==
                            JSON.stringify(value[key]);

                            let rowClass = "";

                            if (!existsNow && existedBefore) {
                            rowClass =
                                "bg-red-500/10 text-red-300";
                            } else if (
                            !existedBefore ||
                            hasChanged
                            ) {
                            rowClass =
                                "bg-emerald-500/10 text-emerald-200";
                            }

                            return (
                            <tr
                                key={key}
                                className={rowClass}
                            >
                                <td className="border-b border-zinc-900 px-3 py-2 font-mono">
                                {formatValue(key)}
                                </td>

                                <td className="border-b border-zinc-900 px-3 py-2 font-mono">
                                {existsNow
                                    ? formatValue(value[key])
                                    : "<removed>"}
                                </td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
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