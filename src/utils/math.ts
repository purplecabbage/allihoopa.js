export function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export function clampUnit(value: number) {
    return clamp(value, 0, 1);
}
