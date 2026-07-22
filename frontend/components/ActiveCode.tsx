type ActiveCodeProps = {
    code: string;
    activeLine: number | null;
};

export default function ActiveCode({
    code,
    activeLine,
}: ActiveCodeProps) {
    return (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="mb-3 text-lg font-semibold">
                Active code
            </h2>

            <div className="overflow-x-auto rounded-lg bg-zinc-950 py-2 font-mono text-sm">
                {code.split("\n").map((codeLine, index) => {
                    const lineNumber = index + 1;
                    const isActive = activeLine === lineNumber;

                    return (
                        <div
                            key={lineNumber}
                            className={`flex min-h-6 px-3 ${
                                isActive
                                ? "bg-yellow-500/20 text-yellow-200"
                                : ""
                            }`}
                            >
                            <span className="mr-4 w-6 select-none text-right text-zinc-600">
                                {lineNumber}
                            </span>

                            <pre>{codeLine || " "}</pre>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}