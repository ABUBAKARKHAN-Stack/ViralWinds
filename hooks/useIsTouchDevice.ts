import { useEffect, useState } from "react";

export const useIsTouchDevice = () => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const hasTouch =
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia("(pointer: coarse)").matches;

        setIsTouchDevice(hasTouch);
    }, []);

    return isTouchDevice;
};