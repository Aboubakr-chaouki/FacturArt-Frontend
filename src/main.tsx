import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import App from "./App"
import "./styles/index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <TooltipProvider>
                <App />
                <Toaster position="top-right" closeButton richColors />
            </TooltipProvider>
        </BrowserRouter>
    </React.StrictMode>
)