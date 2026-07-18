import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Moon, Sun} from "lucide-react";
import {useCallback} from "react";

export function ThemeToggle({
                                tooltipText = "Changer de thème",
                                className = "",
                            }: Readonly<{
    tooltipText?: string
    className?: string
}>) {
    const toggleTheme = useCallback(() => {
        document.documentElement.classList.toggle("dark")
    }, [])

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className={`rounded-full ${className}`.trim()}
                    >
                        <Sun className="size-[1.2rem] rotate-0 scale-100  transition-all dark:rotate-90 dark:scale-0" />
                        <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">{tooltipText}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{tooltipText}</p></TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
