type ErrorSetter = (error: string | null) => void;

class ErrorManager {
    private errorSetter: ErrorSetter | null = null;

    register(setter: ErrorSetter) {
        this.errorSetter = setter;
    }

    setError(error: string | null) {
        if (this.errorSetter) {
            this.errorSetter(error);
        }
    }
}

export const errorManager = new ErrorManager();
