"use client";

import { useState } from "react";

import ActiveCode from "@/components/ActiveCode";
import CodeInputPanel from "@/components/CodeInputPanel";
import ExecutionControls from "@/components/ExecutionControls";
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

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const currentStep: TraceStep | null =
    trace?.steps[currentStepIndex] ?? null;

  async function handleRun(): Promise<void> {
    setError(null);
    setIsLoading(true);

    try {
      const parsedArgs: unknown = JSON.parse(argsText);

      if (!Array.isArray(parsedArgs)) {
        throw new Error(
          "Function arguments harus berupa JSON array.",
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
      setCurrentStepIndex(0);
    } finally {
      setIsLoading(false);
    }
  }

  function goToPreviousStep(): void {
    setCurrentStepIndex((currentIndex) =>
      Math.max(currentIndex - 1, 0),
    );
  }

  function goToNextStep(): void {
    if (!trace) {
      return;
    }

    setCurrentStepIndex((currentIndex) =>
      Math.min(
        currentIndex + 1,
        trace.steps.length - 1,
      ),
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
          <CodeInputPanel
            code={code}
            functionName={functionName}
            argsText={argsText}
            isLoading={isLoading}
            error={error}
            onCodeChange={setCode}
            onFunctionNameChange={setFunctionName}
            onArgsTextChange={setArgsText}
            onRun={handleRun}
          />

          <div className="space-y-4">
            <ActiveCode
              code={code}
              activeLine={currentStep?.line ?? null}
            />

            <ExecutionControls
              currentStep={currentStep}
              currentStepIndex={currentStepIndex}
              totalSteps={trace?.steps.length ?? 0}
              onPrevious={goToPreviousStep}
              onNext={goToNextStep}
            />

            {trace && (
              <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <h2 className="mb-2 text-lg font-semibold">
                  Final result
                </h2>

                <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 text-sm">
                  {JSON.stringify(trace.result, null, 2)}
                </pre>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}