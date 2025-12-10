// 커스텀 에러 베이스 클래스
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request (형식 오류, validation 실패)
export class BadRequestError extends HttpError {
  constructor(message = "잘못된 요청입니다.") {
    super(400, message);
  }
}

// 401 Unauthorized (비밀번호 실패)
export class UnauthorizedError extends HttpError {
  constructor(message = "인증 정보가 일치하지 않습니다.") {
    super(401, message);
  }
}

// 404 Not Found (유저, 글, 상품 등이 존재하지 않음)
export class NotFoundError extends HttpError {
  constructor(message = "요청한 리소스를 찾을 수 없습니다.") {
    super(404, message);
  }
}

//409 Conflict (닉네임, 이메일 등 중복된 데이터)
export class ConflictError extends HttpError {
  constructor(message = "중복된 데이터 입니다.") {
    super(409, message);
  }
}

// 500 Internal Server Error
export class InternalServerError extends HttpError {
  constructor(message = "서버 내부 오류가 발생했습니다.") {
    super(500, message);
  }
}
