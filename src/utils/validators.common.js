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

/**
 * 값(value)의 길이 체크
 * 길이 기본값  minLength = 3, maxLength = 10
 */
export const validateLength = ({
  value,
  path,
  minLength = 3,
  maxLength = 10,
}) => {
  if (value.length < minLength || value.length > maxLength) {
    throw new BadRequestError({
      path: `${path}`,
      message: `${path}은(는) ${minLength} ~ ${maxLength}자로 작성해 주세요`,
    });
  }
};

//값(value) array(배열) 체크
export const validateArray = ({ value, path }) => {
  if (!Array.isArray(value)) {
    throw new BadRequestError({
      path,
      message: `${path}은(는) 배열 형식이어야 합니다`,
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

//값(value) Data type 체크
export const validateDate = ({ value, path }) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new BadRequestError({
      path,
      message: `Invalid type ${value.toString()}`,
    });
  }
};
/**
 * 값(value) Number로 변환 가능한지 체크
 * 숫자 외 값은 차단
 * "1":통과, "한번":차단
 */
export const validateNumber = ({ value, path }) => {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    throw new BadRequestError({
      path,
      message: "must be a number",
    });
  }
};

//값(value) 0, 소수, 음수 차단
export const validatePositiveInteger = ({ value, path }) => {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    throw new BadRequestError({
      path,
      message: "숫자만 입력해주세요",
    });
  }
  if (numberValue <= 0 || !Number.isInteger(numberValue)) {
    throw new BadRequestError({
      path,
      message: "1보다 작거나 소수는 사용할 수 없습니다",
    });
  }
};

//값(value) URL, protocol, extension 체크
export const validatePhotoUrl = ({ value, path }) => {
  const ALLOWED_EXTENSION = ["jpg", "jpeg", "png"];
  let url;

  //1.URL 형식 검사
  try {
    url = new URL(value);
  } catch {
    throw new BadRequestError({
      path,
      message: `${path} must be a valid URL`,
    });
  }
  //2.프로토콜 형식 검사
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new BadRequestError({
      path,
      message: "프로토콜 형식이 맞지 않습니다.",
    });
  }
  //3.확장자 검사
  const pathname = url.pathname;
  const extension = pathname.includes(".")
    ? pathname.split(".").pop().toLowerCase()
    : "";

  if (!ALLOWED_EXTENSION.includes(extension)) {
    throw new BadRequestError({
      path,
      message: `jpg, jpeg, png 확장자만 사용 가능합니다`,
    });
  }
};

//값(value) URL 형식 체크
export const validateUrl = ({ value, path }) => {
  try {
    new URL(value);
  } catch {
    throw new BadRequestError({
      path,
      message: "URL 형식이 맞지 않습니다",
    });
  }
};

//값(value) time 형식 체크
export const validateTime = ({ value, path }) => {
  const time = new Date(value);
  if (Number.isNaN(time.getTime())) {
    throw new BadRequestError({
      path,
      message: "유요하지 않은 시간(time) 형식입니다",
    });
  }
};
