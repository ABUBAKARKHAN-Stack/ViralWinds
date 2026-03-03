import { useEffect, useState } from "react";

export const useIsTouchDevice = () => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");

        const handleChange = () => {
            setIsTouchDevice(mediaQuery.matches);
        }; 

        handleChange();
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return isTouchDevice;
};