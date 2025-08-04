let intervalId: NodeJS.Timeout | null = null;

export function autoSave(period: number, save: () => void, shouldSave: () => boolean) {
    intervalId = setInterval(() => {
        if (shouldSave()) save();
    }, period);
}

export function cancelAutoSave() {
    if (intervalId) clearInterval(intervalId);
}
