'use strict';

const generate = require('./scripts/generate');
const copy = require('./scripts/copy');
const compileWithTypescript = require('./scripts/compileWithTypescript');
const server = require('./scripts/server');
const browser = require('./scripts/browser');

describe('v2.fetch', () => {
    beforeAll(async () => {
        await generate('v2/fetch', 'v2', 'fetch');
        await copy('v2/fetch');
        compileWithTypescript('v2/fetch');
        await server.start('v2/fetch');
        await browser.start();
    }, 30000);

    afterAll(async () => {
        await browser.stop();
        await server.stop();
    });

    it('requests token', async () => {
        await browser.exposeFunction('tokenRequest', jest.fn().mockResolvedValue('MY_TOKEN'));
        const result = await browser.evaluate(async () => {
            const { OpenAPI, SimpleService } = window.api;
            OpenAPI.TOKEN = window.tokenRequest;
            return await SimpleService.getCallWithoutParametersAndResponse();
        });
        expect(result.headers.authorization).toBe('Bearer MY_TOKEN');
    });

    it('supports complex params', async () => {
        const result = await browser.evaluate(async () => {
            const { ComplexService } = window.api;
            return await ComplexService.complexTypes({
                first: {
                    second: {
                        third: 'Hello World!',
                    },
                },
            });
        });
        expect(result).toBeDefined();
    });

    it('can abort the request', async () => {
        let error;
        try {
            await browser.evaluate(async () => {
                const { SimpleService } = window.api;
                const promise = SimpleService.getCallWithoutParametersAndResponse();
                setTimeout(() => {
                    promise.cancel();
                }, 10);
                await promise;
            });
        } catch (e) {
            error = e.message;
        }
        expect(error).toContain('The user aborted a request.');
    });

    it('should throw known error (500)', async () => {
        const error = await browser.evaluate(async () => {
            try {
                const { ErrorService } = window.api;
                await ErrorService.testErrorCode(500);
            } catch (e) {
                return JSON.stringify({
                    name: e.name,
                    message: e.message,
                    url: e.url,
                    status: e.status,
                    statusText: e.statusText,
                    body: e.body,
                });
            }
        });

        expect(error).toBe(
            JSON.stringify({
                name: 'ApiError',
                message: 'Custom message: Internal Server Error',
                url: 'http://localhost:3000/base/api/v1.0/error?status=500',
                status: 500,
                statusText: 'Internal Server Error',
                body: 'Internal Server Error',
            })
        );
    });

    it('should throw unknown error (409)', async () => {
        const error = await browser.evaluate(async () => {
            try {
                const { ErrorService } = window.api;
                await ErrorService.testErrorCode(409);
            } catch (e) {
                return JSON.stringify({
                    name: e.name,
                    message: e.message,
                    url: e.url,
                    status: e.status,
                    statusText: e.statusText,
                    body: e.body,
                });
            }
        });
        expect(error).toBe(
            JSON.stringify({
                name: 'ApiError',
                message: 'Generic Error',
                url: 'http://localhost:3000/base/api/v1.0/error?status=409',
                status: 409,
                statusText: 'Conflict',
                body: 'Conflict',
            })
        );
    });
});
