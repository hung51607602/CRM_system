export const AVAILABLE_LOCATIONS = [
    'HK - I FIT',
    'HK - 落腳地',
    'PEN - SHAKE & SHAPE'
];

export const LOCATION_DISPLAY_MAP: Record<string, string> = {
    '灣仔': 'HK - I FIT',
    '黃大仙': 'HK - 落腳地',
    '石門': 'PEN - SHAKE & SHAPE',
    'HK - I FIT': 'HK - I FIT',
    'HK - 落腳地': 'HK - 落腳地',
    'PEN - SHAKE & SHAPE': 'PEN - SHAKE & SHAPE'
};

export const getLocationDisplay = (location: string): string => {
    return LOCATION_DISPLAY_MAP[location] || location;
};
