export interface RoastTemplate {
    pattern: RegExp;
    roasts: {
        mild: string[];
        savage: string[];
        nuclear: string[];
    };
    fixSuggestion?: string;
}

export type SavageLevel = 'mild' | 'savage' | 'nuclear';

export interface ErrorMatch {
    original: string;
    roast: string;
    fixSuggestion?: string;
    emoji: string;
}