import { escapeDescription } from './escapeDescription';

describe('escapeDescription', () => {
    it('should escape', () => {
        expect(escapeDescription('')).toEqual('');
        expect(escapeDescription('fooBar')).toEqual('fooBar');
        expect(escapeDescription('foo `test` bar')).toEqual('foo \\`test\\` bar');
    });
});
