import { RoastTemplate, SavageLevel, ErrorMatch } from './types';

export class RoastEngine {
    private templates: RoastTemplate[] = [
        // Null/Undefined Errors
        {
            pattern: /cannot read propert(y|ies) ['"](\w+)['"] of (null|undefined)/i,
            roasts: {
                mild: [
                    "Yo, that property doesn't exist bestie 😅",
                    "Umm... checking null maybe? Just saying 👀",
                    "That variable ghosted you fr 👻"
                ],
                savage: [
                    "Bro really tried to read from nothing 💀",
                    "Your code said 'nah' to that property lmaooo 😂",
                    "Null called, it wants its dignity back 🔥",
                    "That's cap—nothing exists there homie 🧢"
                ],
                nuclear: [
                    "DELETE THIS RIGHT NOW I'M BEGGING 💀💀💀",
                    "Who hurt you? Add a null check you psychopath 😭",
                    "This code belongs in the dumpster fire 🗑️🔥",
                    "My grandma writes better code and she's dead 💀"
                ]
            },
            fixSuggestion: "Add optional chaining: obj?.property"
        },
        // Undefined Variable
        {
            pattern: /(\w+) is not defined/i,
            roasts: {
                mild: [
                    "That variable doesn't exist yet friend 🤔",
                    "Did you forget to declare that? Happens to everyone 😊"
                ],
                savage: [
                    "Bro where's the declaration??? Not giving main character 💀",
                    "This variable is MIA—did you even define it? 😂",
                    "Undefined behavior? More like undefined brain cell activity 🧠❌"
                ],
                nuclear: [
                    "WHAT VARIABLE?! THERE IS NO VARIABLE!! 😱",
                    "The audacity to use something that doesn't exist 🤡",
                    "Your IDE been screaming but you don't listen 📢💀"
                ]
            },
            fixSuggestion: "Declare the variable first: let varName = value;"
        },
        // Infinite Loop
        {
            pattern: /(infinite loop|maximum call stack|too much recursion)/i,
            roasts: {
                mild: [
                    "Your loop's running forever... might wanna check that 🔄",
                    "That's an infinite situation right there 😬"
                ],
                savage: [
                    "Your loop ghosted the exit condition 💀",
                    "Bro's computer is STRUGGLING—fix that loop fr 🔥",
                    "That loop said 'ima run forever' and meant it 😂",
                    "This code running longer than a CVS receipt 🧾💀"
                ],
                nuclear: [
                    "YOU'RE KILLING MY CPU STOP IT 🚨🚨🚨",
                    "This loop more infinite than my disappointment 💀",
                    "Task Manager bout to end YOU not the process 😭"
                ]
            },
            fixSuggestion: "Add a proper exit condition or break statement"
        },
        // Type Errors
        {
            pattern: /(type|TypeError|is not a function)/i,
            roasts: {
                mild: [
                    "Wrong type there buddy 🎯",
                    "Type mismatch vibes... check your data 📊"
                ],
                savage: [
                    "TypeScript literally TOLD you this would happen 💀",
                    "That's not even the right type fam 😂",
                    "You're giving string energy to a number function 🔥",
                    "Type error hit different when you ignore the warnings 🧢"
                ],
                nuclear: [
                    "USE TYPESCRIPT YOU ABSOLUTE MENACE 😤",
                    "The types are fighting and your code lost 💀💀",
                    "This isn't even the right type planet 🌍❌"
                ]
            },
            fixSuggestion: "Check types: typeof variable === 'expected'"
        },
        // Syntax Errors
        {
            pattern: /(unexpected token|unexpected identifier|syntax error)/i,
            roasts: {
                mild: [
                    "Syntax looking sus right there 👀",
                    "Check your brackets friend 🔍"
                ],
                savage: [
                    "Your syntax is BUSSIN... in a bad way 💀",
                    "Bro forgot how to write code apparently 😂",
                    "That syntax more broken than my sleep schedule 🔥",
                    "This ain't it chief—missing a bracket somewhere 🧢"
                ],
                nuclear: [
                    "DID YOU CLOSE YOUR BRACKETS?!?! 😱😱",
                    "This looks like you coded with your eyes closed 💀",
                    "Copy-paste broke you fr 📋❌"
                ]
            },
            fixSuggestion: "Check for missing brackets, commas, or semicolons"
        },
        // Array/Index Errors
        {
            pattern: /(cannot read property|undefined index|out of bounds)/i,
            roasts: {
                mild: [
                    "That index doesn't exist in the array 📝",
                    "Array bounds exceeded homie 🚫"
                ],
                savage: [
                    "You're reaching for air—that index ain't there 💀",
                    "Array said 'nothing to see here' 😂",
                    "Out of bounds? More like out of your mind 🔥"
                ],
                nuclear: [
                    "ARRAYS START AT ZERO NOT ONE 🗣️🗣️🗣️",
                    "You really thought element 100 existed in a 5-item array 🤡"
                ]
            },
            fixSuggestion: "Check array length before accessing: if (i < arr.length)"
        },
        // Promise/Async Errors
        {
            pattern: /(unhandled promise|promise rejection|await)/i,
            roasts: {
                mild: [
                    "Promise rejected... might wanna catch that 🎣",
                    "Async issues detected 🔄"
                ],
                savage: [
                    "Your promise got rejected harder than a bad pickup line 💀",
                    "Catch that promise or catch these hands 😂",
                    "Unhandled rejection giving 'I give up' energy 🔥"
                ],
                nuclear: [
                    "TRY-CATCH EXISTS FOR A REASON USE IT 😤",
                    "This promise rejection hitting different 💀💀"
                ]
            },
            fixSuggestion: "Use try-catch or .catch() to handle promise rejections"
        },
        // Import/Module Errors
        {
            pattern: /(cannot find module|module not found|import)/i,
            roasts: {
                mild: [
                    "That module isn't installed yet 📦",
                    "Import path looking wrong bestie 🛤️"
                ],
                savage: [
                    "Did you npm install or just hope it worked? 💀",
                    "Module said 'I don't exist' and dipped 😂",
                    "That import path more lost than me in math class 🔥"
                ],
                nuclear: [
                    "RUN NPM INSTALL YOU DONUT 🍩💀",
                    "The module is in node_modules not your imagination 😭"
                ]
            },
            fixSuggestion: "Run: npm install <package-name>"
        },
        // Division by Zero
        {
            pattern: /(division by zero|divide by zero|infinity)/i,
            roasts: {
                mild: [
                    "Can't divide by zero friend 🧮",
                    "Math says no to that division 🚫"
                ],
                savage: [
                    "You really tried to divide by zero??? 💀",
                    "Math teachers everywhere just felt a disturbance 😂",
                    "That's mathematically mid behavior 🔥"
                ],
                nuclear: [
                    "ELEMENTARY MATH FAILED YOU 🤡🤡🤡",
                    "Zero called, it doesn't want your division 📞💀"
                ]
            },
            fixSuggestion: "Add check: if (divisor !== 0)"
        }
    ];

    private emojis = {
        mild: ['😅', '😊', '🤔', '👀', '😬', '🔍'],
        savage: ['💀', '😂', '🔥', '🧢', '👻', '🗣️'],
        nuclear: ['💀💀💀', '😭', '🚨', '🤡', '😱', '🗑️']
    };

    public translateError(errorMessage: string, level: SavageLevel = 'savage'): ErrorMatch | null {
        for (const template of this.templates) {
            if (template.pattern.test(errorMessage)) {
                const roastArray = template.roasts[level];
                const randomRoast = roastArray[Math.floor(Math.random() * roastArray.length)];
                const randomEmoji = this.emojis[level][Math.floor(Math.random() * this.emojis[level].length)];

                return {
                    original: errorMessage,
                    roast: randomRoast,
                    fixSuggestion: template.fixSuggestion,
                    emoji: randomEmoji
                };
            }
        }
        return null;
    }

    public getRandomRoastForUnknown(level: SavageLevel = 'savage'): string {
        const genericRoasts = {
            mild: [
                "Something went wrong... you got this though! 💪",
                "Error detected, but you'll fix it 😊"
            ],
            savage: [
                "Not sure what you did but it's broken 💀",
                "Your code said 'nah I'm out' 😂",
                "This error different—still broken tho 🔥"
            ],
            nuclear: [
                "WHAT DID YOU DO?!?! 😱😱😱",
                "This error so rare even Stack Overflow gave up 💀",
                "Congratulations, you broke it in a new way 🏆💀"
            ]
        };
        const roasts = genericRoasts[level];
        return roasts[Math.floor(Math.random() * roasts.length)];
    }
}