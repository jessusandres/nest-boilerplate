import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

/* Project */
import { ApiResponse } from '../dto';

type ApiOkOptions = {
  description?: string;
  isArray?: boolean;
  nullable?: boolean;
};

export function ApiOkResponseWithData<TModel extends Type<unknown>>(
  model: TModel,
  options?: ApiOkOptions,
) {
  const dataSchema = options?.isArray
    ? { type: 'array', items: { $ref: getSchemaPath(model) } }
    : { $ref: getSchemaPath(model) };

  if (options?.nullable) {
    (dataSchema as any).nullable = true;
  }

  return applyDecorators(
    ApiExtraModels(ApiResponse, model),
    ApiOkResponse({
      description: options?.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            type: 'object',
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
}
