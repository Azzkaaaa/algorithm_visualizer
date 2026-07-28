"use client";

import { useEffect, useState } from "react";

import ActiveCode from "@/components/ActiveCode";
import CodeInputPanel from "@/components/CodeInputPanel";
import ExecutionControls from "@/components/ExecutionControls";
import { createTrace } from "@/lib/api";
import type {
  TraceResponse,
  TraceStep,
} from "@/types/trace";
import {
  ALGORITHM_PRESETS,
} from "@/data/algorithmPresets";


const DEFAULT_PRESET = ALGORITHM_PRESETS[0];



export default function HomePage() {
  const [selectedPresetId, setSelectedPresetId] =
    useState(DEFAULT_PRESET.id);

  const [code, setCode] =
    useState(DEFAULT_PRESET.code);

  const [functionName, setFunctionName] =
    useState(DEFAULT_PRESET.functionName);

  const [argsText, setArgsText] =
    useState(DEFAULT_PRESET.argsText);

  const [trace, setTrace] =
    useState<TraceResponse | null>(null);

  const [currentStepIndex, setCurrentStepIndex] =
    useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1000);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const currentStep: TraceStep | null =
    trace?.steps[currentStepIndex] ?? null;
  
  const previousStep: TraceStep | null =
    trace && currentStepIndex > 0
      ? trace.steps[currentStepIndex - 1]
      : null;
  
  useEffect(() => {
    if (
      !isPlaying ||
      !trace ||
      trace.steps.length === 0
    ) {
      return;
    }

    const lastIndex = trace.steps.length - 1;

    const timeoutId = window.setTimeout(() => {
      const nextIndex = Math.min(
        currentStepIndex + 1,
        lastIndex,
      );

      setCurrentStepIndex(nextIndex);

      if (nextIndex >= lastIndex) {
        setIsPlaying(false);
      }
    }, speedMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    isPlaying,
    speedMs,
    trace,
    currentStepIndex,
  ]);

  async function handleRun(): Promise<void> {
    setIsPlaying(false);
    setTrace(null);
    setCurrentStepIndex(0);
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
    setIsPlaying(false);

    setCurrentStepIndex((currentIndex) =>
      Math.max(currentIndex - 1, 0),
    );
  }

  function goToNextStep(): void {
    if (!trace) {
      return;
    }

    setIsPlaying(false);

    setCurrentStepIndex((currentIndex) =>
      Math.min(
        currentIndex + 1,
        trace.steps.length - 1,
      ),
    );
  }

  function togglePlayPause(): void {
    if (!trace) {
      return;
    }

    if (currentStepIndex >= trace.steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((currentValue) => !currentValue);
  }

  function resetExecution(): void {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }

  function handlePresetChange(
    presetId: string,
  ): void {
    setSelectedPresetId(presetId);
    setIsPlaying(false);
    setTrace(null);
    setCurrentStepIndex(0);
    setError(null);

    if (presetId === "custom") {
      return;
    }

    const selectedPreset =
      ALGORITHM_PRESETS.find(
        (preset) => preset.id === presetId,
      );

    if (!selectedPreset) {
      return;
    }

    setCode(selectedPreset.code);
    setFunctionName(selectedPreset.functionName);
    setArgsText(selectedPreset.argsText);
  }

  function handleCodeChange(value: string): void {
    setCode(value);
    setSelectedPresetId("custom");
    clearExecution();
  }

  function handleFunctionNameChange(
    value: string,
  ): void {
    setFunctionName(value);
    setSelectedPresetId("custom");
    clearExecution();
  }

  function handleArgsTextChange(
    value: string,
  ): void {
    setArgsText(value);
    setSelectedPresetId("custom");
    clearExecution();
  }

  function clearExecution(): void {
    setIsPlaying(false);
    setTrace(null);
    setCurrentStepIndex(0);
    setError(null);
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">
            Algorithm Visualizer
          </h1>

        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <CodeInputPanel
            code={code}
            functionName={functionName}
            argsText={argsText}
            isLoading={isLoading}
            error={error}
            presets={ALGORITHM_PRESETS}
            selectedPresetId={selectedPresetId}
            onPresetChange={handlePresetChange}
            onCodeChange={handleCodeChange}
            onFunctionNameChange={
              handleFunctionNameChange
            }
            onArgsTextChange={handleArgsTextChange}
            onRun={handleRun}
          />

          <div className="space-y-4">
            <ActiveCode
              code={code}
              activeLine={currentStep?.line ?? null}
            />

            <ExecutionControls
              currentStep={currentStep}
              previousStep={previousStep}
              currentStepIndex={currentStepIndex}
              totalSteps={trace?.steps.length ?? 0}
              isPlaying={isPlaying}
              speedMs={speedMs}
              onPrevious={goToPreviousStep}
              onNext={goToNextStep}
              onPlayPause={togglePlayPause}
              onReset={resetExecution}
              onSpeedChange={setSpeedMs}
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