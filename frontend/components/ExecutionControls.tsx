import type { TraceStep } from "@/types/trace";

import VariablePanel from "./VariablePanel";
import CallStackVisualizer from "./CallStackVisualizer";

type ExecutionControlsProps = {
    currentStep: TraceStep | null;
    previousStep: TraceStep | null;
    currentStepIndex: number;
    totalSteps: number;
    isPlaying: boolean;
    speedMs: number;
    onPrevious: () => void;
    onNext: () => void;
    onPlayPause: () => void;
    onReset: () => void;
    onSpeedChange: (speedMs: number) => void;
};

export default function ExecutionControls({
    currentStep,
    previousStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    speedMs,
    onPrevious,
    onNext,
    onPlayPause,
    onReset,
    onSpeedChange,
}: ExecutionControlsProps) {
    const hasTrace = currentStep !== null;
    const isLastStep =
        hasTrace && currentStepIndex >= totalSteps - 1;

    return (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
            Execution
            </h2>

            <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={onReset}
                disabled={!hasTrace}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Reset
            </button>

            <button
                type="button"
                onClick={onPrevious}
                disabled={!hasTrace || currentStepIndex === 0}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Previous
            </button>

            <button
                type="button"
                onClick={onPlayPause}
                disabled={!hasTrace}
                className="rounded-lg bg-blue-600 px-3 py-1.5 font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {isPlaying
                    ? "Pause"
                    : isLastStep
                    ? "Replay"
                    : "Play"}
            </button>

            <button
                type="button"
                onClick={onNext}
                disabled={!hasTrace || isLastStep}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Next
            </button>
            </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
            <label
            htmlFor="execution-speed"
            className="text-sm text-zinc-400"
            >
            Speed
            </label>

            <select
            id="execution-speed"
            value={speedMs}
            onChange={(event) =>
                onSpeedChange(Number(event.target.value))
            }
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm"
            >
            <option value={1500}>0.5x</option>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={250}>4x</option>
            </select>
        </div>

        {!currentStep && (
            <p className="text-zinc-500">
            Jalankan kode untuk melihat execution trace.
            </p>
        )}

        {currentStep && (
            <>
            <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                <InfoCard
                label="Step"
                value={`${currentStepIndex + 1} / ${totalSteps}`}
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

            <CallStackVisualizer
                frames={currentStep.call_stack}
            />

            <h3 className="mb-2 font-semibold">
                Local variables
            </h3>

            <VariablePanel
                variables={currentStep.locals}
                previousVariables={previousStep?.locals ?? {}}
            />
            </>
        )}
        </section>
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