"use client";
import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";

type TProps = {
    count: number;
    delay?: number; 
};

export function AnimatedActivityCount({ count, delay = 200 }: TProps) {
    const [valueToAnimate, setValueToAnimate] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setValueToAnimate(count);
        }, delay);

        return () => clearTimeout(timer);
    }, [count, delay]);

    return (
        <NumberFlow
            value={valueToAnimate}
            transformTiming={{ duration: 750, easing: "ease-out" }}
            spinTiming={{ duration: 750, easing: "ease-out" }}
            opacityTiming={{ duration: 350, easing: "ease-out" }}
        />
    );
}

