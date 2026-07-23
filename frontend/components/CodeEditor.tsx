"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(
    () => import("@monaco-editor/react"),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-96 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-sm text-zinc-500">
                Loading editor...
            </div>
        ),
    },
);

type CodeEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function CodeEditor({
    value,
    onChange,
}: CodeEditorProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-zinc-700">
            <MonacoEditor
                height="420px"
                language="python"
                theme="vs-dark"
                value={value}
                onChange={(newValue) => {
                    onChange(newValue ?? "");
                }}
                options={{
                    minimap: {
                        enabled: false,
                    },
                    fontSize: 14,
                    lineHeight: 22,
                    tabSize: 4,
                    insertSpaces: true,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: "off",
                    padding: {
                        top: 12,
                        bottom: 12,
                    },
                }}
            />
        </div>
    );
}