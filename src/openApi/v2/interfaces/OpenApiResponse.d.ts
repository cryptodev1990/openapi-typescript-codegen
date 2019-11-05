import { Dictionary } from '../../../utils/types';
import { OpenApiExample } from './OpenApiExample';
import { OpenApiHeader } from './OpenApiHeader';
import { OpenApiSchema } from './OpenApiSchema';

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#responseObject
 */
export interface OpenApiResponse {
    description: string;
    schema?: OpenApiSchema;
    headers?: Dictionary<OpenApiHeader>;
    examples?: OpenApiExample;
}
