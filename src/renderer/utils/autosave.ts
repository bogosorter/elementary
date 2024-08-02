let timeoutId: NodeJS.Timeout | null = null;

export function autoSave(period: number, save: () => void, shouldSave: () => boolean) {
    timeoutId = setTimeout(() => {
        if (shouldSave()) save();
        autoSave(period, save, shouldSave);
    }, period);
}

export function cancelAutoSave() {
    if (timeoutId) clearTimeout(timeoutId);
}
