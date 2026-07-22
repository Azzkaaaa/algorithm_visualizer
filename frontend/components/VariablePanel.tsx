import ArrayVisualizer from "./ArrayVisualizer";

type VariablePanelProps = {
    variables: Record<string, unknown>;
    previousVariables: Record<string, unknown>;
};

type ArrayVisualizerProps = {
    name: string;
    values: unknown[];
    previousValues?: unknown[];
    activeIndex?: number | null;
};

export default function VariablePanel({ variables, previousVariables }: VariablePanelProps) {
    const entries = Object.entries(variables);

    if (entries.length === 0) {
        return (
            <p className="text-sm text-zinc-500">
                Belum ada local variables.
            </p>
        );
    }

    const possibleActiveIndex =
        typeof variables.i === "number"
        ? variables.i
        : typeof variables.index === "number"
            ? variables.index
            : null;

    return (
        <div className="space-y-3">
            {entries.map(([name, value]) => {
                const previousValue = previousVariables[name];
                const hasChanged =
                    JSON.stringify(previousValue) !== JSON.stringify(value);

                if (Array.isArray(value)) {
                return (
                    <ArrayVisualizer
                        key={name}
                        name={name}
                        values={value}
                        previousValues={
                            Array.isArray(previousValue)
                                ? previousValue
                                : undefined
                        }
                        activeIndex={possibleActiveIndex}
                    />
                );
                }

                return (
                    <PrimitiveVariable
                        key={name}
                        name={name}
                        value={value}
                        hasChanged={hasChanged}
                    />
                );
            })}
        </div>
    );
}

type PrimitiveVariableProps = {
    name: string;
    value: unknown;
    hasChanged: boolean;
}

function PrimitiveVariable({
    name,
    value,
    hasChanged,
}: PrimitiveVariableProps) {
    return (
        <div
            className={`rounded-lg border p-3 ${
                hasChanged
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-transparent bg-zinc-950"
            }`}
        >
            <span className="font-mono text-blue-300">
                {name}
            </span>

            <span className="mx-2 text-zinc-600">=</span>

            <span className="font-mono">
                {formatValue(value)}
            </span>
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

    const serialized = JSON.stringify(value);

    return serialized ?? String(value);
}