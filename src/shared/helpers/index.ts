import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';

/* External */
import { ValidationError } from 'class-validator';
import { Request } from 'express';

const blockedKeys = ['pass', 'password', 'card'];

export const filterRequestParams = (req: Request) => {
  return Object.entries({
    ...req.params,
    ...req.body,
    ...req.query,
  })
    .map(([key, value]) =>
      blockedKeys.includes(key) ? { key, value: '******' } : { key, value },
    )
    .reduce((accumulator, current) => {
      return { ...accumulator, [current.key]: current.value };
    }, {});
};

export const constraintsAccumulator = (errors: ValidationError[]) => {
  return errors
    .map((err: ValidationError) => Object.values(err.constraints as any))
    .reduce((accumulator, next) => [...accumulator, ...next], []);
};

export const fillChildrenErrors = (
  validationError: ValidationError,
  errorsArray: any[],
) => {
  if (validationError?.children && validationError.children.length) {
    validationError.children.forEach((children) => {
      fillChildrenErrors(children, errorsArray);
    });
  } else {
    errorsArray.push(validationError);
  }
};

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
