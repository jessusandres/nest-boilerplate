import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';

/* External */
import { ValidationError } from 'class-validator';
import { Request } from 'express';

type Dict = Record<string, unknown>;

const blockedKeys = ['pass', 'password', 'card'];

export const filterRequestParams = (req: Request) => {
  const params: Dict = (req.params ?? {}) as Dict;
  const body: Dict = (req.body ?? {}) as Dict;
  const query: Dict = (req.query ?? {}) as Dict;

  return Object.entries({ ...params, ...body, ...query })
    .map(([key, value]) =>
      blockedKeys.includes(key) ? { key, value: '******' } : { key, value },
    )
    .reduce((accumulator, current) => {
      return { ...accumulator, [current.key]: current.value };
    }, {});
};

const constraintsAccumulator = (errors: ValidationError[]) => {
  return errors
    .map((err: ValidationError) => Object.values(err.constraints ?? {}))
    .reduce((accumulator, next) => [...accumulator, ...next], []);
};
export default constraintsAccumulator;

/**
 * Default validation options for global pipe and tests
 */
export const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (errors) => {
    const constraints = constraintsAccumulator(errors);

    throw new BadRequestException(
      `Some data isn't valid: ${constraints.toString()}`,
      {
        cause: errors,
      },
    );
  },
};

export const fileExtension = (fileName: string): string => {
  const secureFileName = fileName || '';

  return secureFileName.split('.').pop() || '';
};
