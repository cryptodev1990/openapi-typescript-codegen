export function getEnumTypeFromDescription(description: string, addParentheses: boolean = false): string | null {
    // Check if we can find this special format string:
    // None=0,Something=1,AnotherThing=2
    if (/^(\w+=[0-9]+,?)+$/g.test(description)) {
        const matches: RegExpMatchArray | null = description.match(/(\w+=[0-9]+,?)/g);
        if (matches) {
            // Grab the values from the description
            const values: number[] = [];
            matches.forEach(match => {
                const value = parseInt(match.split('=')[1].replace(/[^0-9]/g, ''));
                if (Number.isInteger(value)) {
                    values.push(value);
                }
            });

            // Filter and sort the values
            const entries: string[] = values
                .sort()
                .filter((name, index, arr) => arr.indexOf(name) === index)
                .map(value => String(value));

            // Add grouping parentheses if needed. This can be handy if enum values
            // are used in Arrays, so that you will get the following definition:
            // const myArray: ('EnumValue1' | 'EnumValue2' | 'EnumValue3')[];
            if (entries.length > 1 && addParentheses) {
                return `(${entries.join(' | ')})`;
            }

            return entries.join(' | ');
        }
    }

    return null;
}
