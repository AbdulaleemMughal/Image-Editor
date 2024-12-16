export const filterElements = [
    {
        name: 'brightness',
        maxValue: 200,
    },
    {
        name: 'grayscale',
        maxValue: 200,
    },
    {
        name: 'sepia',
        maxValue: 200,
    },
    {
        name: 'saturate',
        maxValue: 200,
    },
    {
        name: 'contrast',
        maxValue: 200,
    },
    {
        name: 'hueRotate',
    },
];

export interface ImageInterface {
    image: string;
    brightness: number;
    grayscale: number;
    sepia: number;
    saturate: number;
    contrast: number;
    hueRotate: number;
    rotate: number;
    vertical: number;
    horizontal: number;
}

export interface PropertyInterface {
    name: string;
    maxValue?: number | undefined;
}