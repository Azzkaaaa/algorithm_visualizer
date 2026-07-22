import ArrayVisualizer from "./ArrayVisualizer";

type VariablePanelProps = {
    variables: Record<string, unknown>;
};

export default function VariablePanel({ variables }: VariablePanelProps) {
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
                if (Array.isArray(value)) {
                return (
                    <ArrayVisualizer
                        key={name}
                        name={name}
                        values={value}
                        activeIndex={possibleActiveIndex}
                    />
                );
                }

                return (
                    <PrimitiveVariable
                        key={name}
                        name={name}
                        value={value}
                    />
                );
            })}
        </div>
    );
}

type PrimitiveVariableProps = {
    name: string;
    value: unknown;
}

function PrimitiveVariable({
    name,
    value,
}: PrimitiveVariableProps) {
    return (
        <div className="rounded-lg bg-zinc-950 p-3">
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