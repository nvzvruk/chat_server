import {
  Catch,
  UnauthorizedException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // TODO Apply or delete this filter

    response.status(401).json({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
}
