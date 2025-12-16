import { BadRequestError } from "../errors/customError.js";

//값(value)의 null, undefind, length === 0 체크
export const validateRequired = ({ value, path }) => {
  if (!value || value.trim().length === 0) {
    throw new BadRequestError({
      path: `${path}`,
      message: `${path} is required`,
    });
  }
};

//값(value)의 앞 뒤 공백 체크
export const validateWhitespace = ({ value, path }) => {
  if (/\s/.test(value)) {
    throw new BadRequestError({
      path: `${path}`,
      message: `앞 뒤 공백없이 입력해주세요`,
    });
  }
};
