//../modeules/groups/groups-workout-validation.js

//기록되는 운동 3가지 defination
const recordingWorkoutType = ["run", "bicycle", "swim"];

export const validateWorkoutRecord = (req, res, next) => {
  const {
    authorNickname,
    workoutType,
    description,
    time,
    distance,
    images,
    authorPassword,
  } = req.body;

  if (
    !authorNickname ||
    !authorPassword ||
    !workoutType ||
    time === undefined ||
    distance === undefined
  ) {
    return res.status(400).json({
      message:
        "필수 항목(닉네임, 비밀번호, 운동 종류, 시간, 거리)이 누락되었습니다.",
    });
  }

  // nickname, password validation
  if (
    typeof authorNickname !== "string" ||
    authorNickname.trim().length === 0 ||
    typeof authorPassword !== "string" ||
    authorPassword.trim().length === 0
  ) {
    return res.status(400).json({
      message: "닉네임과 비밀번호는 유효한 문자열이어야 합니다.",
    });
  }

  //distance, time validatoin
  if (typeof time !== "number" || time < 0) {
    return res.status(400).json({
      message: "운동 시간은 0 이상의 유효한 숫자(초)여야 합니다.",
    });
  }
  if (typeof distance !== "number" || distance < 0) {
    return res.status(400).json({
      message: "거리는 0 이상의 유효한 숫자여야 합니다.",
    });
  }

  //workoutType validatoin
  if (!recordingWorkoutType.includes(workoutType)) {
    return res.status(400).json({
      message: `유효하지 않은 운동 종류입니다. 허용된 종류: ${recordingWorkoutType.join(", ")}`,
    });
  }

  //descripton => sting
  if (description !== undefined && typeof description !== "string") {
    return res
      .status(400)
      .json({ message: "설명은 문자열 타입이어야 합니다." });
  }
  //images
  if (
    images !== undefined &&
    (!Array.isArray(images) || !images.every((img) => typeof img === "string"))
  ) {
    return res.status(400).json({
      message: "사진은 문자열 URL로 구성된 배열이어야 합니다.",
    });
  }

  next();
};
