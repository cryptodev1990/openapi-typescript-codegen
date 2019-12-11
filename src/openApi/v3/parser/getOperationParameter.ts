import {OpenApi} from '../interfaces/OpenApi';
import {OpenApiParameter} from '../interfaces/OpenApiParameter';
import {OperationParameter} from '../../../client/interfaces/OperationParameter';
import {PrimaryType} from './constants';
import {getComment} from './getComment';
import {getModel} from './getModel';
import {getModelDefault} from './getModelDefault';
import {getOperationParameterName} from './getOperationParameterName';
import {getType} from './getType';

export function getOperationParameter(openApi: OpenApi, parameter: OpenApiParameter): OperationParameter {
    const operationParameter: OperationParameter = {
        in: parameter.in,
        prop: parameter.name,
        export: 'interface',
        name: getOperationParameterName(parameter.name),
        type: PrimaryType.OBJECT,
        base: PrimaryType.OBJECT,
        template: null,
        link: null,
        description: getComment(parameter.description),
        isProperty: false,
        isReadOnly: false,
        isRequired: parameter.required === true,
        isNullable: parameter.nullable === true,
        imports: [],
        extends: [],
        enum: [],
        enums: [],
        properties: [],
    };

    if (parameter.$ref) {
        const definitionRef = getType(parameter.$ref);
        operationParameter.export = 'reference';
        operationParameter.type = definitionRef.type;
        operationParameter.base = definitionRef.base;
        operationParameter.template = definitionRef.template;
        operationParameter.imports.push(...definitionRef.imports);
        return operationParameter;
    }

    if (parameter.schema) {
        if (parameter.schema.$ref) {
            const model = getType(parameter.schema.$ref);
            operationParameter.export = 'reference';
            operationParameter.type = model.type;
            operationParameter.base = model.base;
            operationParameter.template = model.template;
            operationParameter.imports.push(...model.imports);
            operationParameter.default = getModelDefault(parameter.schema);
            operationParameter.isRequired = operationParameter.default || operationParameter.isRequired;

            return operationParameter;
        } else {
            const model = getModel(openApi, parameter.schema);
            operationParameter.export = model.export;
            operationParameter.type = model.type;
            operationParameter.base = model.base;
            operationParameter.template = model.template;
            operationParameter.link = model.link;
            operationParameter.isReadOnly = model.isReadOnly;
            operationParameter.isRequired = model.isRequired;
            operationParameter.isNullable = model.isNullable;
            operationParameter.format = model.format;
            operationParameter.maximum = model.maximum;
            operationParameter.exclusiveMaximum = model.exclusiveMaximum;
            operationParameter.minimum = model.minimum;
            operationParameter.exclusiveMinimum = model.exclusiveMinimum;
            operationParameter.multipleOf = model.multipleOf;
            operationParameter.maxLength = model.maxLength;
            operationParameter.minLength = model.minLength;
            operationParameter.pattern = model.pattern;
            operationParameter.maxItems = model.maxItems;
            operationParameter.minItems = model.minItems;
            operationParameter.uniqueItems = model.uniqueItems;
            operationParameter.maxProperties = model.maxProperties;
            operationParameter.minProperties = model.minProperties;
            operationParameter.default = model.default;
            operationParameter.isRequired = model.default || model.isRequired;
            operationParameter.imports.push(...model.imports);
            operationParameter.extends.push(...model.extends);
            operationParameter.enum.push(...model.enum);
            operationParameter.enums.push(...model.enums);
            operationParameter.properties.push(...model.properties);
            return operationParameter;
        }
    }

    return operationParameter;
}
