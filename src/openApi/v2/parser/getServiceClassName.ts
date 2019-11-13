import camelCase from 'camelcase';

/**
 * Convert the input value to a correct service classname. This converts
 * the input string to PascalCase and appends the "Service" prefix if needed.
 */
export function getServiceClassName(value: string): string {
    const clean: string = value.replace(/[^\w\s\-]+/g, '_').trim();
    const name: string = camelCase(clean, { pascalCase: true });
    if (name && !name.endsWith('Service')) {
        return `${name}Service`;
    }
    return name;
}
