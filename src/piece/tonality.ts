const MAJOR_SCALES = [
    [ true, false,  true, false,  true,  true, false,  true, false,  true, false,  true],
    [ true,  true, false,  true, false,  true,  true, false,  true, false,  true, false],
    [false,  true,  true, false,  true, false,  true,  true, false,  true, false,  true],
    [ true, false,  true,  true, false,  true, false,  true,  true, false,  true, false],
    [false,  true, false,  true,  true, false,  true, false,  true,  true, false,  true],
    [ true, false,  true, false,  true,  true, false,  true, false,  true,  true, false],
    [false,  true, false,  true, false,  true,  true, false,  true, false,  true,  true],
    [ true, false,  true, false,  true, false,  true,  true, false,  true, false,  true],
    [ true,  true, false,  true, false,  true, false,  true,  true, false,  true, false],
    [false,  true,  true, false,  true, false,  true, false,  true,  true, false,  true],
    [ true, false,  true,  true, false,  true, false,  true, false,  true,  true, false],
    [false,  true, false,  true,  true, false,  true, false,  true, false,  true,  true],
];

export function getMajorScale(index: number): boolean[] {
    if (index < 0 || index >= 12) {
        throw new Error('Index must be between 0 and 11, inclusive');
    }

    return MAJOR_SCALES[index];
}
