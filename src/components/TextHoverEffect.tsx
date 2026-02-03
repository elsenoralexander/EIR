"use client";
import React, { useRef, useEffect, useState, useId } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
    text,
    duration,
}: {
    text: string;
    duration?: number;
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
    const uniqueId = useId().replace(/:/g, "");

    useEffect(() => {
        if (svgRef.current) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
            const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
            setMaskPosition({
                cx: `${cxPercentage}%`,
                cy: `${cyPercentage}%`,
            });
        }
    }, [cursor]);

    return (
        <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 300 100"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
            className="select-none"
        >
            <defs>
                <linearGradient
                    id={`textGradient-${uniqueId}`}
                    gradientUnits="userSpaceOnUse"
                    cx="50%"
                    cy="50%"
                    r="25%"
                >
                    {hovered && (
                        <>
                            <stop offset="0%" stopColor="#10b981" /> {/* Emerald */}
                            <stop offset="25%" stopColor="#34d399" />
                            <stop offset="50%" stopColor="#f59e0b" /> {/* Amber */}
                            <stop offset="75%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#10b981" />
                        </>
                    )}
                </linearGradient>

                <motion.radialGradient
                    id={`revealMask-${uniqueId}`}
                    gradientUnits="userSpaceOnUse"
                    r="30%"
                    initial={{ cx: "50%", cy: "50%" }}
                    animate={maskPosition}
                    transition={{ duration: duration ?? 0, ease: "easeOut" }}
                >
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                </motion.radialGradient>
                <mask id={`textMask-${uniqueId}`}>
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill={`url(#revealMask-${uniqueId})`}
                    />
                </mask>
            </defs>
            {/* Background (Always visible outline) */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.5"
                className="fill-transparent stroke-white/10 font-display font-black text-7xl uppercase"
            >
                {text}
            </text>
            {/* Animation stroke */}
            <motion.text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.5"
                className="fill-transparent stroke-emerald-500/20 font-display font-black text-7xl uppercase"
                initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
                animate={{
                    strokeDashoffset: 0,
                    strokeDasharray: 1000,
                }}
                transition={{
                    duration: 4,
                    ease: "easeInOut",
                }}
            >
                {text}
            </motion.text>
            {/* Hover reveal (The rainbow part) */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                stroke={`url(#textGradient-${uniqueId})`}
                strokeWidth="0.8"
                mask={`url(#textMask-${uniqueId})`}
                className="fill-transparent font-display font-black text-7xl uppercase"
            >
                {text}
            </text>
        </svg>
    );
};
