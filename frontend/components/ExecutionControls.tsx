import type { TraceStep } from "@/types/trace";

import VariablePanel from "./VariablePanel";

type ExecutionControlsProps = {
    currentStep: TraceStep | null;
    currentStepIndex: number;
    totalSteps: number;
    onPrevious: () => void;
    onNext: () => void;
};

export default function ExecutionControls({
    currentStep,
    currentStepIndex,
    totalSteps,
    onPrevious,
    onNext,
}: ExecutionControlsProps) {
    return (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">
                    Execution
                </h2>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onPrevious}
                        disabled={!currentStep || currentStepIndex === 0}
                        className="rounded-lg border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <button
                        type="button"
                        onClick={onNext}
                        disabled={
                            !currentStep ||
                            currentStepIndex >= totalSteps - 1
                        }
                        className="rounded-lg border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
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

                    <h3 className="mb-2 font-semibold">
                        Local variables
                    </h3>

                    <VariablePanel
                        variables={currentStep.locals}
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
            <div className="text-zinc-500">
                {label}
            </div>

            <div className="mt-1 font-mono">
                {value}
            </div>
        </div>
    );
}