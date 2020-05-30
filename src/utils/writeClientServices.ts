import * as path from 'path';

import { Service } from '../client/interfaces/Service';
import { writeFile } from './fileSystem';
import { format } from './format';
import { Templates } from './registerHandlebarTemplates';

/**
 * Generate Services using the Handlebar template and write to disk.
 * @param services Array of Services to write.
 * @param templates The loaded handlebar templates.
 * @param outputPath Directory to write the generated files to.
 * @param useOptions Use options or arguments functions.
 */
export async function writeClientServices(services: Service[], templates: Templates, outputPath: string, useOptions: boolean): Promise<void> {
    for (const service of services) {
        const file = path.resolve(outputPath, `${service.name}.ts`);
        const templateResult = templates.service({
            ...service,
            useOptions,
        });
        await writeFile(file, format(templateResult));
    }
}
