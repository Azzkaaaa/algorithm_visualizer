export type TraceEvent = 
    | "call"
    | "return"
    | "line"
    | "exception"

export type TraceStep = {
    step: number;
    line: number;
    event: TraceEvent;
    function: string;
    locals: Record<string, unknown>;
    return_value: unknown;
};

export type TraceResponse = {
    result: unknown;
    steps: TraceStep[];
};

export type TraceRequest = {
    code: string;
    function_name: string;
    args: unknown[];
    kwargs: Record<string, unknown>;
};