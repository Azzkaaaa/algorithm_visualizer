type ArrayVisualizerProps = {
    name: string;
    values: unknown[];
    previousValues?: unknown[];
    activeIndex?: number | null;
};

export default function ArrayVisualizer({
  name,
  values,
  previousValues,
  activeIndex = null,
}: ArrayVisualizerProps) {
  return (
    <div className="rounded-lg bg-zinc-950 p-3">
      <div className="mb-3 font-mono text-blue-300">
        {name}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {values.map((value, index) => {
          const isActive = activeIndex === index;
          const hasChanged =
            previousValues !== undefined &&
            JSON.stringify(previousValues[index]) !==
              JSON.stringify(value);

          return (
            <div
              key={index}
              className="text-center"
            >
              <div
                className={`min-w-12 rounded border px-3 py-2 font-mono ${
                  isActive
                    ? "border-yellow-400 bg-yellow-500/20 text-yellow-200"
                    : hasChanged
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-200"
                      : "border-zinc-700"
                }`}
              >
                {formatValue(value)}
              </div>

              <div className="mt-1 text-xs text-zinc-600">
                {index}
              </div>
            </div>
          );
        })}
      </div>
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