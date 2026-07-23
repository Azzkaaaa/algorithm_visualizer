import CodeEditor from "./CodeEditor";

type CodeInputPanelProps = {
  code: string;
  functionName: string;
  argsText: string;
  isLoading: boolean;
  error: string | null;
  onCodeChange: (value: string) => void;
  onFunctionNameChange: (value: string) => void;
  onArgsTextChange: (value: string) => void;
  onRun: () => void;
};

export default function CodeInputPanel({
  code,
  functionName,
  argsText,
  isLoading,
  error,
  onCodeChange,
  onFunctionNameChange,
  onArgsTextChange,
  onRun,
}: CodeInputPanelProps) {
    return (
        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div>
                <label
                    htmlFor="function-name"
                    className="mb-2 block text-sm font-medium"
                >
                    Function name
                </label>

                <input
                    id="function-name"
                    value={functionName}
                        onChange={(event) =>
                            onFunctionNameChange(event.target.value)
                }
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label
                    htmlFor="code"
                    className="mb-2 block text-sm font-medium"
                >
                    Python code
                </label>

                <CodeEditor
                    value={code}
                    onChange={onCodeChange}
                />
            </div>

            <div>
                <label
                    htmlFor="args"
                    className="mb-2 block text-sm font-medium"
                >
                    Function arguments
                </label>

                <textarea
                    id="args"
                    value={argsText}
                    onChange={(event) =>
                        onArgsTextChange(event.target.value)
                    }
                    spellCheck={false}
                    className="min-h-32 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-sm outline-none focus:border-blue-500"
                />
            </div>

            <button
                type="button"
                onClick={onRun}
                disabled={isLoading}
                className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? "Running..." : "Run code"}
            </button>

            {error && (
                <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-red-300">
                    {error}
                </div>
            )}
        </section>
    );
}