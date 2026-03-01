import { useEffect, useState } from "react";

export const useIsTouchDevice = () => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const touch =
            navigator.maxTouchPoints > 0 ||
            window.matchMedia("(pointer: coarse)").matches;

        setIsTouchDevice(touch);
    }, []);

    return isTouchDevice
}