import { BadRequestError } from "../errors/customError.js";

//값(value) null, undefind, length === 0 체크
export const validateRequired = ({ value, path }) => {
  if (!value || value.toString().length === 0) {
    throw new BadRequestError({
      path,
      message: `${path} is required`,
    });
  }
};

//값(value) 앞 뒤 공백 체크
export const validateWhitespace = ({ value, path }) => {
  if (/\s/.test(value)) {
    throw new BadRequestError({
      path,
      message: `앞 뒤 공백없이 입력해주세요`,
    });
  }
};

//값(value) Data type 체크
export const validateDate = ({ value, path }) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new BadRequestError({
      path,
      message: `Invalid type ${value.toString()}`,
    });
  }
};

//값(value) Int type 체크
export const validateInt = ({ value, path }) => {
  if (typeof value !== "number") {
    throw new BadRequestError({
      path,
      message: `Invalid type ${typeof value}`,
    });
  }
};

//값(value) string type 체크
export const validateString = ({ value, path }) => {
  if (typeof value !== "string") {
    throw new BadRequestError({
      path,
      message: `Invalid type ${typeof value}`,
    });
  }
};
