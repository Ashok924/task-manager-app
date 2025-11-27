"use client";

import { ReactNode } from "react";

interface AlertContainerProps {
    children: ReactNode;
}

const AlertContainer = ({ children }: AlertContainerProps) => {
    return (
        <div
            className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-3 pointer-events-none"
            style={{ maxWidth: 'calc(100vw - 3rem)' }}
        >
            <div className="pointer-events-auto">
                {children}
            </div>
        </div>
    );
};

export default AlertContainer;
