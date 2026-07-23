import ArrayVisualizer, {
  type ArrayPointer,
} from "./ArrayVisualizer";

const POINTER_VARIABLE_NAMES = new Set([
  "i",
  "j",
  "index",
  "left",
  "right",
  "middle",
  "mid",
  "low",
  "high",
  "start",
  "end",
]);

type VariablePanelProps = {
  variables: Record<string, unknown>;
  previousVariables: Record<string, unknown>;
};

export default function VariablePanel({
  variables,
  previousVariables,
}: VariablePanelProps) {
    const entries = Object.entries(variables);

    if (entries.length === 0) {
        return (
            <p className="text-sm text-zinc-500">
                Belum ada local variables.
            </p>
        );
    }

    const arrayEntries = entries.filter(([, value]) =>
        Array.isArray(value),
    );

    const shouldUseAutoPointers =
        arrayEntries.length === 1;

    const pointerCandidates: ArrayPointer[] = entries
        .filter(
        ([name, value]) =>
            POINTER_VARIABLE_NAMES.has(name) &&
            typeof value === "number" &&
            Number.isInteger(value),
        )
        .map(([name, value]) => ({
        name,
        index: value as number,
        }));

    return (
        <div className="space-y-3">
            {entries.map(([name, value]) => {
                const previousValue = previousVariables[name];

                const hasChanged =
                JSON.stringify(previousValue) !==
                JSON.stringify(value);

                if (Array.isArray(value)) {
                    const pointersForCurrentArray =
                        shouldUseAutoPointers
                        ? pointerCandidates.filter(
                            (pointer) =>
                                pointer.index >= 0 &&
                                pointer.index < value.length,
                            )
                        : [];

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
                            pointers={pointersForCurrentArray}
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
};

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

            <span className="mx-2 text-zinc-600">
                =
            </span>

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