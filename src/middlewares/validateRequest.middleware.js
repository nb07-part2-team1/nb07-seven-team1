import { BadRequestError } from "../errors/customError.js";

/**
 *  타입, 필수 검증을 위한 미들웨어
 *
 * @param {Object<string, {
 *  type: 'string' | 'number' | 'boolean' | 'array' | 'stringInt'
 *  required?: boolean
 * }>} schema
 *
 * @param {'body' | 'query' | 'params'} target
 *
 * @returns
 *
 */
export const validateRequest = (schema, target = "body") => {
  return (req, res, next) => {
    const data = req[target];

    for (const key in schema) {
      const rules = schema[key];
      const value = data[key];

      // 필수 검증
      if (rules.required && (value === undefined || value === null)) {
        throw new BadRequestError({ message: `${key} is required` });
      }

      // 필수값이 아니여서 값이 없는 값들 패스
      if (value === undefined || value === null) continue;

      // 배열 체크
      if (rules.type === "array") {
        if (!Array.isArray(value)) {
          throw new BadRequestError({
            message: `${key}의 타입이 array가 아닙니다.`,
          });
        }
        continue;
      }

      // BigInt 체크
      if (rules.type === "stringInt") {
        if (typeof value !== "string" || !/^\d+$/.test(value)) {
          throw new BadRequestError({
            message: `${key}는 정수 문자열이어야 합니다.`,
            path: key,
          });
        }
        continue;
      }

      // 나머지 타입 체크
      if (typeof value !== rules.type) {
        throw new BadRequestError({
          message: `${key}의 타입이 ${rules.type}이/가 아닙니다.`,
        });
      }
    }

    next();
  };
};
