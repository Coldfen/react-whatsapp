import React from "react";

export interface WindowSize {
    width: undefined | number
    height: undefined | number
    isMobile?: boolean
    transform: undefined | string
}

export default function useWindowSize() {
    const [windowSize, setWindowSize] = React.useState<WindowSize>({
        width: undefined,
        height: undefined,
        isMobile: undefined,
        transform: undefined
    });

    React.useEffect(() => {
        function handleResize() {
            if (window.innerHeight > 768 && window.innerWidth > 1366) {
                const currentRatio = window.innerHeight / window.innerWidth;
                const ratio = 768 / 1366;
                if (ratio < currentRatio) {
                    setWindowSize({
                        width: 1366,
                        height: window.innerHeight * (1366 / window.innerWidth),
                        transform: `scale(${window.innerWidth / 1366})`,
                    });
                } else if (ratio > currentRatio) {
                    setWindowSize({
                        width: window.innerWidth * (768 / window.innerHeight),
                        height: 768,
                        transform: `scale(${window.innerHeight / 768})`,
                    });
                } else {
                    setWindowSize({
                        width: 1366,
                        height: 768,
                        transform: `scale(${window.innerHeight / 768})`,
                    });
                }
            }
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth <= 760,
                transform: `scale(1)`,
            });
        }
        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}
