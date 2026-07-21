import type{
    TraceRequest,
    TraceResponse,
} from "@/types/trace";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type ErrorResponse = {
    detail?: {
        message?: string;
    } | string;
};

export async function createTrace(payload: TraceRequest): Promise<TraceResponse> {
    const response = await fetch(`${API_URL}/api/trace`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const body = await response.json() as TraceResponse | ErrorResponse;

    if (!response.ok){
        let message = "Gagal menjalanakan kode";
        if ("detail" in body && typeof body.detail === "string"){
            message = body.detail;
        }
        
        if ("detail" in body && typeof body.detail === "object" && body.detail?.message){
            message = body.detail.message;
        }

        throw new Error(message);
    }
    return body as TraceResponse;
}