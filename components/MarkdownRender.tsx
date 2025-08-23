import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

export function MarkdownRenderer({ content }: { content: string }) {
    const components: Components = {
        h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mt-4 mb-2" {...props} />
        ),
        h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold mt-3 mb-2" {...props} />
        ),
        h3: ({ node, ...props }) => (
            <h3 className="text-xl font-medium mt-2 mb-1" {...props} />
        ),
        ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside ml-4" {...props} />
        ),
        ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside ml-4" {...props} />
        ),
        code({
            node,
            inline,
            className,
            children,
            ...props
        }: {
            node?: any
            inline?: boolean
            className?: string
            children: React.ReactNode
        }) {
            return inline ? (
                <code className="bg-gray-100 px-1 py-0.5 rounded" {...props}>
                    {children}
                </code>
            ) : (
                <pre className="bg-gray-900 text-white p-3 rounded-lg overflow-x-auto">
                    <code {...props}>{children}</code>
                </pre>
            )
        },
    }

    return (
        <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {content}
            </ReactMarkdown>
        </div>
    )
}
