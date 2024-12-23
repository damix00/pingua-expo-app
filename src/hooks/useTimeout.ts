import { useEffect, useRef } from "react";

export function useTimeout(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    const callFunction = () => {
        savedCallback.current();
    };

    useEffect(() => {
        if (delay !== null) {
            const id = setTimeout(callFunction, delay);
            return () => clearTimeout(id);
        }
    }, [delay]);
}

export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    const callFunction = () => {
        savedCallback.current();
    };

    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(callFunction, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
