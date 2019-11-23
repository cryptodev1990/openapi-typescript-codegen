import * as path from 'path';
import * as ts from 'typescript';
import { OpenApiVersion, getOpenApiVersion } from './utils/getOpenApiVersion';
import { getOpenApiSpec } from './utils/getOpenApiSpec';
import { parse as parseV2 } from './openApi/v2';
import { parse as parseV3 } from './openApi/v3';
import { readHandlebarsTemplates } from './utils/readHandlebarsTemplates';
import { writeClient } from './utils/writeClient';

export enum Language {
    TYPESCRIPT = 'typescript',
    JAVASCRIPT = 'javascript',
}

export enum HttpClient {
    FETCH = 'fetch',
    XHR = 'xhr',
}

/**
 * Generate the OpenAPI client. This method will read the OpenAPI specification and based on the
 * given language it will generate the client, including the typed models, validation schemas,
 * service layer, etc.
 * @param input The relative location of the OpenAPI spec.
 * @param output The relative location of the output directory.
 * @param language: The language that should be generated (Typescript or Javascript).
 * @param httpClient: The selected httpClient (fetch or XHR).
 */
export function generate(input: string, output: string, language: Language = Language.TYPESCRIPT, httpClient: HttpClient = HttpClient.FETCH): void {
    const inputPath = path.resolve(process.cwd(), input);
    const outputPath = path.resolve(process.cwd(), output);

    try {
        // Load the specification, read the OpenAPI version and load the
        // handlebar templates for the given language
        const openApi = getOpenApiSpec(inputPath);
        const openApiVersion = getOpenApiVersion(openApi);
        const templates = readHandlebarsTemplates(language);

        switch (language) {
            case Language.JAVASCRIPT:
            case Language.TYPESCRIPT:
                // Generate and write version 2 client
                if (openApiVersion === OpenApiVersion.V2) {
                    const clientV2 = parseV2(openApi);
                    writeClient(clientV2, language, httpClient, templates, outputPath);
                }

                // Generate and write version 3 client
                if (openApiVersion === OpenApiVersion.V3) {
                    const clientV3 = parseV3(openApi);
                    writeClient(clientV3, language, httpClient, templates, outputPath);
                }
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

export function compile(dir: string): void {
    const config = {
        compilerOptions: {
            target: 'esnext',
            module: 'commonjs',
            moduleResolution: 'node',
        },
        include: ['./index.ts'],
    };
    const configFile = ts.parseConfigFileTextToJson('tsconfig.json', JSON.stringify(config));
    const configFileResult = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.resolve(process.cwd(), dir), undefined, 'tsconfig.json');
    const compilerHost = ts.createCompilerHost(configFileResult.options);
    const compiler = ts.createProgram(configFileResult.fileNames, configFileResult.options, compilerHost);
    compiler.emit();
}
