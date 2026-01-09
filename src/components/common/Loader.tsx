import { Loader2 } from "lucide-react"

interface LoaderProps {
    fullScreen?: boolean
    text?: string
}

export function Loader({ fullScreen, text = "Loading..." }: LoaderProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            {text && <p className="text-muted-foreground font-medium">{text}</p>}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {content}
            </div>
        )
    }

    return <div className="p-10 w-full flex justify-center">{content}</div>
}
