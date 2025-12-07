'use client';

import { useEffect } from 'react';

export default function InitClient() {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            document.body.classList.remove('is-preload');
        }, 100);
        return () => clearTimeout(timeoutId);
    }, []);

    return null;
}
