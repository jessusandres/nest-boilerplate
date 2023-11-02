import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';

/* Extra */
import { ValidationError } from 'class-validator';
import { Request } from 'express';

/* Project */
import { getEnv } from './env';

const blockedKeys = ['pass', 'password', 'card'];

const filterRequestParams = (req: Request) => {
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

const constraintsAccumulator = (errors: ValidationError[]) => {
  return errors
    .map((err) => Object.values(err.constraints))
    .reduce((accumulator, next) => [...accumulator, ...next], []);
};

/**
 * Default validation options for global pipe and tests
 */
const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const constraints = constraintsAccumulator(errors);

    throw new BadRequestException(`Some data isn't valid: ${constraints}`, {
      cause: errors,
    });
  },
};

export {
  getEnv,
  filterRequestParams,
  constraintsAccumulator,
  validationPipeOptions,
};
