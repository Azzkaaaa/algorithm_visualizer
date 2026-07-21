"use client";

import { useState } from "react";

import { createTrace } from "@/lib/api";
import type {
  TraceResponse,
  TraceStep,
} from "@/types/trace";

const DEFAULT_CODE = `def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []`;

const DEFAULT_ARGS = `[
  [2, 7, 11, 15],
  9
]`;

export default function HomePage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [functionName, setFunctionName] =
    useState("two_sum");
  const [argsText, setArgsText] =
    useState(DEFAULT_ARGS);

  const [trace, setTrace] =
    useState<TraceResponse | null>(null);
  const [currentStepIndex, setCurrentStepIndex] =
    useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    null,
  );

  const currentStep: TraceStep | null =
    trace?.steps[currentStepIndex] ?? null;

  async function handleRun(): Promise<void> {
    setError(null);
    setIsLoading(true);

    try {
      const parsedArgs: unknown = JSON.parse(argsText);

      if (!Array.isArray(parsedArgs)) {
        throw new Error(
          "Input args harus berupa JSON array.",
        );
      }

      const response = await createTrace({
        code,
        function_name: functionName,
        args: parsedArgs,
        kwargs: {},
      });

      setTrace(response);
      setCurrentStepIndex(0);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Terjadi kesalahan.";

      setError(message);
      setTrace(null);
    } finally {
      setIsLoading(false);
    }
  }

  function goToPreviousStep(): void {
    setCurrentStepIndex((current) =>
      Math.max(current - 1, 0),
    );
  }

  function goToNextStep(): void {
    if (!trace) {
      return;
    }

    setCurrentStepIndex((current) =>
      Math.min(current + 1, trace.steps.length - 1),
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">
            Algorithm Visualizer
          </h1>

          <p className="mt-2 text-zinc-400">
            Visualisasi eksekusi algoritma Python
            langkah demi langkah.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
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
                  setFunctionName(event.target.value)
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

              <textarea
                id="code"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value)
                }
                spellCheck={false}
                className="min-h-96 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-sm outline-none focus:border-blue-500"
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
                  setArgsText(event.target.value)
                }
                spellCheck={false}
                className="min-h-32 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-sm outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleRun}
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

          <section className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h2 className="mb-3 text-lg font-semibold">
                Active code
              </h2>

              <div className="overflow-x-auto rounded-lg bg-zinc-950 py-2 font-mono text-sm">
                {code.split("\n").map((codeLine, index) => {
                  const lineNumber = index + 1;
                  const isActive =
                    currentStep?.line === lineNumber;

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
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">
                  Execution
                </h2>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    disabled={
                      !trace || currentStepIndex === 0
                    }
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={
                      !trace ||
                      currentStepIndex >=
                        trace.steps.length - 1
                    }
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>

              {!currentStep && (
                <p className="text-zinc-500">
                  Jalankan kode untuk melihat trace.
                </p>
              )}

              {currentStep && trace && (
                <>
                  <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                    <InfoCard
                      label="Step"
                      value={`${currentStepIndex + 1} / ${trace.steps.length}`}
                    />

                    <InfoCard
                      label="Event"
                      value={currentStep.event}
                    />

                    <InfoCard
                      label="Line"
                      value={String(currentStep.line)}
                    />

                    <InfoCard
                      label="Function"
                      value={currentStep.function}
                    />
                  </div>

                  <h3 className="mb-2 font-semibold">
                    Local variables
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(
                      currentStep.locals,
                    ).map(([name, value]) => (
                      <VariableCard
                        key={name}
                        name={name}
                        value={value}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {trace && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <h2 className="mb-2 text-lg font-semibold">
                  Final result
                </h2>

                <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 text-sm">
                  {JSON.stringify(trace.result, null, 2)}
                </pre>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-lg bg-zinc-950 p-3">
      <div className="text-zinc-500">{label}</div>
      <div className="mt-1 font-mono">{value}</div>
    </div>
  );
}

type VariableCardProps = {
  name: string;
  value: unknown;
};

function VariableCard({
  name,
  value,
}: VariableCardProps) {
  if (Array.isArray(value)) {
    return (
      <div className="rounded-lg bg-zinc-950 p-3">
        <div className="mb-3 font-mono text-blue-300">
          {name}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {value.map((item, index) => (
            <div key={index} className="text-center">
              <div className="min-w-12 rounded border border-zinc-700 px-3 py-2 font-mono">
                {formatValue(item)}
              </div>

              <div className="mt-1 text-xs text-zinc-600">
                {index}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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

  return JSON.stringify(value);
}