import React from "react"

export const colors = {
    dark:   "#0D3D2E",
    green:  "#2ECC8E",
    light:  "#E1F5EE",
    accent: "#F0FDF8",
} as const;

export const btnStyle = {
    primary: {
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 24px", fontSize: 14, fontWeight: 600,
        color: "white", background: "#0D3D2E",
        borderRadius: 12, textDecoration: "none",
        border: "none", cursor: "pointer", transition: "all 0.2s",
    } as React.CSSProperties,
    ghost: {
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 24px", fontSize: 14, fontWeight: 600,
        color: "#0D3D2E", background: "white",
        borderRadius: 12, textDecoration: "none",
        border: "1.5px solid #e5e7eb", cursor: "pointer", transition: "all 0.2s",
    } as React.CSSProperties,
    cta: {
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 24px", fontSize: 14, fontWeight: 600,
        color: "#0D3D2E", background: "#2ECC8E",
        borderRadius: 12, textDecoration: "none",
        border: "none", cursor: "pointer", transition: "all 0.2s",
    } as React.CSSProperties,
} as const;

export const hoverLift = {
    enter: (el: HTMLElement) => {
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "0 12px 30px rgba(13,61,46,0.25)";
    },
    leave: (el: HTMLElement) => {
        el.style.transform = "none";
        el.style.boxShadow = "none";
    },
};

export const hoverCard = {
    enter: (el: HTMLElement) => {
        el.style.boxShadow   = "0 12px 40px rgba(0,0,0,0.09)";
        el.style.transform   = "translateY(-3px)";
        el.style.borderColor = "transparent";
    },
    leave: (el: HTMLElement) => {
        el.style.boxShadow   = "none";
        el.style.transform   = "none";
        el.style.borderColor = "#f1f5f9";
    },
};