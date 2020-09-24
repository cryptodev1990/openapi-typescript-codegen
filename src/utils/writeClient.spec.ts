import { Client } from '../client/interfaces/Client';
import { HttpClient } from '../index';
import { mkdir, rmdir, writeFile } from './fileSystem';
import { Templates } from './registerHandlebarTemplates';
import { writeClient } from './writeClient';

jest.mock('./fileSystem');

describe('writeClient', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: 'v1',
            models: [],
            services: [],
        };

        const templates: Templates = {
            index: () => 'index',
            exports: {
                model: () => 'model',
                schema: () => 'schema',
                service: () => 'service',
            },
            core: {
                settings: () => 'settings',
                apiError: () => 'apiError',
                getFormData: () => 'getFormData',
                getQueryString: () => 'getQueryString',
                isSuccess: () => 'isSuccess',
                request: () => 'request',
                requestOptions: () => 'requestOptions',
                requestUsingFetch: () => 'requestUsingFetch',
                requestUsingXHR: () => 'requestUsingXHR',
                result: () => 'result',
            },
        };

        await writeClient(client, templates, './dist', HttpClient.FETCH, false, false, true, true, true, true);

        expect(rmdir).toBeCalled();
        expect(mkdir).toBeCalled();
        expect(writeFile).toBeCalled();
    });
});
