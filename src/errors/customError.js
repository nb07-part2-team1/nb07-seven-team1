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
  constructor(msg) {
    if (typeof msg === "string") {
      super(400, msg);
      return;
    }

    const { message = "잘못된 요청입니다.", path } = msg || {};

    super(400, message);

    if (path !== undefined) {
      this.path = path;
    }
  }
}

// 401 Unauthorized (비밀번호 실패)
export class UnauthorizedError extends HttpError {
  constructor(msg) {
    if (typeof msg === "string") {
      super(401, msg);
      return;
    }

    const { message = "인증 정보가 일치하지 않습니다.", path } = msg || {};

    super(401, message);

    if (path !== undefined) {
      this.path = path;
    }
  }
}

// 404 Not Found (유저, 글, 상품 등이 존재하지 않음)
export class NotFoundError extends HttpError {
  constructor(msg) {
    if (typeof msg === "string") {
      super(404, msg);
      return;
    }

    const { message = "해당 정보를 찾을 수 없습니다.", path } = msg || {};

    super(404, message);

    if (path !== undefined) {
      this.path = path;
    }
  }
}

//409 Conflict (닉네임, 이메일 등 중복된 데이터)
export class ConflictError extends HttpError {
  constructor(msg) {
    if (typeof msg === "string") {
      super(409, msg);
      return;
    }

    const { message = "중복 된 데이터 입니다.", path } = msg || {};

    super(409, message);

    if (path !== undefined) {
      this.path = path;
    }
  }
}

// 500 Internal Server Error
export class InternalServerError extends HttpError {
  constructor(msg) {
    if (typeof msg === "string") {
      super(500, msg);
      return;
    }

    const { message = "서버 내부 오류가 발생했습니다.", path } = msg || {};

    super(500, message);

    if (path !== undefined) {
      this.path = path;
    }
  }
}
