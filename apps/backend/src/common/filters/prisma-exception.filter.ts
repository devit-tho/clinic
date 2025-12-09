// prisma-exception.filter.tsimport { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@repo/database';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError, PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: PrismaClientKnownRequestError | PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2000':
          status = HttpStatus.BAD_REQUEST;
          message = `Value too long for field: ${exception.meta?.target}`;
          break;

        case 'P2001':
          status = HttpStatus.NOT_FOUND;
          message = `Record not found for ${exception.meta?.modelName}`;
          break;

        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = `Duplicate entry for ${exception.meta?.target}`;
          break;

        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = `Foreign key constraint failed on field: ${exception.meta?.field_name}`;
          break;

        case 'P2004':
          status = HttpStatus.BAD_REQUEST;
          message = `A constraint failed on the database: ${exception.meta?.constraint}`;
          break;

        case 'P2005':
          status = HttpStatus.BAD_REQUEST;
          message = `Invalid value for field type`;
          break;

        case 'P2006':
          status = HttpStatus.BAD_REQUEST;
          message = `Invalid value for field: ${exception.meta?.field_name}`;
          break;

        case 'P2007':
          status = HttpStatus.BAD_REQUEST;
          message = `Data validation error`;
          break;

        case 'P2008':
          status = HttpStatus.BAD_REQUEST;
          message = `Failed to parse query`;
          break;

        case 'P2009':
          status = HttpStatus.BAD_REQUEST;
          message = `Invalid query`;
          break;

        case 'P2010':
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = `Raw query failed. Check the query syntax or parameters.`;
          break;

        case 'P2011':
          status = HttpStatus.BAD_REQUEST;
          message = `Null constraint violation on field: ${exception.meta?.constraint}`;
          break;

        case 'P2012':
          status = HttpStatus.BAD_REQUEST;
          message = `Missing required value for field: ${exception.meta?.path}`;
          break;

        case 'P2013':
          status = HttpStatus.BAD_REQUEST;
          message = `Missing required argument: ${exception.meta?.argument_name}`;
          break;

        case 'P2014':
          status = HttpStatus.BAD_REQUEST;
          message = `Invalid relation: ${exception.meta?.relation_name}`;
          break;

        case 'P2015':
          status = HttpStatus.NOT_FOUND;
          message = `Related record not found: ${exception.meta?.details}`;
          break;

        case 'P2016':
          status = HttpStatus.BAD_REQUEST;
          message = `Query interpretation error`;
          break;

        case 'P2017':
          status = HttpStatus.BAD_REQUEST;
          message = `Records in relation not connected`;
          break;

        case 'P2018':
          status = HttpStatus.BAD_REQUEST;
          message = `Required connected records were not found`;
          break;

        case 'P2019':
          status = HttpStatus.BAD_REQUEST;
          message = `Input error`;
          break;

        case 'P2020':
          status = HttpStatus.BAD_REQUEST;
          message = `Value out of range`;
          break;

        case 'P2021':
          status = HttpStatus.NOT_FOUND;
          message = `Table does not exist`;
          break;

        case 'P2022':
          const relationField =
            exception.meta?.column || exception.meta?.fieldName;
          const model = exception.meta?.modelName;
          message = relationField
            ? `Invalid relation reference on field '${relationField}' in model '${model}'. The column may be missing or mismatched.`
            : `Invalid reference in relation — a column or foreign key may be missing.`;
          status = HttpStatus.BAD_REQUEST;
          break;

        case 'P2023':
          status = HttpStatus.BAD_REQUEST;
          message = `Inconsistent column data`;
          break;

        case 'P2024':
          status = HttpStatus.REQUEST_TIMEOUT;
          message = `Timeout while trying to connect to the database`;
          break;

        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = `Record not found`;
          break;

        case 'P2026':
          status = HttpStatus.BAD_REQUEST;
          message = `Invalid value stored in the database for field: ${exception.meta?.field_name}`;
          break;

        case 'P2030':
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = `Database error: ${exception.meta?.cause}`;
          break;

        case 'P2033':
          status = HttpStatus.BAD_REQUEST;
          message = `Number too large for column type`;
          break;

        case 'P2034':
          status = HttpStatus.CONFLICT;
          message = `Transaction failed due to a deadlock`;
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = `Prisma error: ${exception.code}`;
          break;
      }
    } else if (exception instanceof PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Prisma validation error: ${exception.message}`;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
