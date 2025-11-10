import { useCallback } from 'react';

export function useInitials() {
    return useCallback((fullName: string): string => {
        const names = fullName.trim().split(' ');

        return names.map((name) => {
            if (name.length > 0) {
                return name.charAt(0)
            }
            return ""
        }).join('')
    }, []);
}
