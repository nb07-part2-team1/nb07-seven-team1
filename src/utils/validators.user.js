import { BadRequestError } from "../errors/customError.js";
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
      path,
      message: `${minLength} ~ ${maxLength}자로 작성해 주세요`,
    });
  }
};
/**
 * 값(value)의 정규 표현식 체크
 * 한글, 영문, 숫자가 아닌 경우 ERROR
 */
export const validateNameRegex = ({ value, path }) => {
  const regex = /^[A-Za-z가-힣][A-Za-z0-9가-힣]*$/;
  if (/^\d/.test(value)) {
    throw new BadRequestError({
      path,
      message: "닉네임은 숫자로 시작할 수 없습니다",
    });
  }
  if (!regex.test(value)) {
    throw new BadRequestError({
      path,
      message: `닉네임은 한글, 영문, 숫자만 사용 가능합니다`,
    });
  }
};
/**
 * 값(value)의 정규 표현식 체크
 * 한글, 영문, 숫자, 특수문자가 없는 경우 ERROR
 */
export const validatePasswordRegex = ({ value, path }) => {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]).{8,20}$/;
  if (!regex.test(value)) {
    throw new BadRequestError({
      path: `${path}`,
      message: `비밀번호는 영문 + 숫자 + 특수문자를 포함해야 합니다`,
    });
  }
};
