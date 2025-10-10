import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { errorManager } from '../libs/errorManager';

interface ErrorContextType {
    error: string | null;
    setError: (error: string | null) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        errorManager.register(setError);
    }, []);

    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {children}
        </ErrorContext.Provider>
    );
}

export function useError() {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within ErrorProvider');
    }
    return context;
}
