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

// // 타입 검증
// if (
//   !exerciseType ||
//   typeof exerciseType !== "string" ||
//   exerciseType.trim().length === 0
// ) {
//   throw new BadRequestError(
//     "운동 종류(exerciseType)는 필수이며 공백이 아닌 문자열이어야 합니다."
//   );
// }
// 설명 검증
// if (description !== undefined && typeof description !== "string") {
//   throw new BadRequestError("설명(description)은 문자열이어야 합니다.");
// }
// if (!time) {
//   throw new BadRequestError("시간(time)은 필수 입력값입니다.");
// }

// // 시간 유효성 검증
// const timeObject = new Date(time);
// if (isNaN(timeObject.getTime())) {
//   throw new BadRequestError("유효하지 않은 시간(time) 형식입니다.");
// }

// // 거리 검증
// if (distance !== undefined && distance !== null) {
//   if (typeof distance !== "number" || distance < 0) {
//     throw new BadRequestError(
//       "거리(distance)는 0 이상의 숫자 형식이어야 합니다."
//     );
//   }
// }
// // images 배열 검증
// if (photos !== undefined && photos !== null && !Array.isArray(photos)) {
//   throw new BadRequestError("사진(photos)은 배열 형태여야 합니다.");
// }
