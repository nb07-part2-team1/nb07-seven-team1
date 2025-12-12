//src/routers/groups/groups-workout.router.js

import express from "express";
import { validateWorkoutRecord } from "../../middlewares/workout.middleware.js";
import {
  createRecord,
  getRecords,
  getRecordDetail,
  updateRecord,
  deleteRecord,
} from "../../modeules/groups/groups-workout.js";

const router = express.Router();

//post
router.post("/records", validateWorkoutRecord, async (req, res, next) => {
  try {
    const newRecord = await createRecord(req.body);

    return res.status(201).json({
      message: "운동 기록이 성공적으로 등록되었습니다.",
      record: newRecord,
    });
  } catch (error) {
    next(error);
  }
});

//get
router.get("/records", async (req, res, next) => {
  try {
    const records = await getRecords(req.query);

    return res.status(200).json(records);
  } catch (error) {
    next(error);
  }
});

//get 상세
router.get("/records/:recordId", async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const recordDetail = await getRecordDetail(recordId);

    return res.status(200).json(recordDetail);
  } catch (error) {
    next(error);
  }
});

//patch
router.patch(
  "/records/:recordId",
  validateWorkoutRecord,
  async (req, res, next) => {
    try {
      const { recordId } = req.params;
      const { authorNickname, authorPassword, ...updateData } = req.body;

      const updatedRecord = await updateRecord(
        recordId,
        updateData,
        authorNickname,
        authorPassword
      );

      return res.status(200).json({
        message: "운동 기록이 성공적으로 수정되었습니다.",
        record: updatedRecord,
      });
    } catch (error) {
      next(error);
    }
  }
);

//delete
router.delete("/records/:recordId", async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const { authorNickname, authorPassword } = req.body;

    const result = await deleteRecord(recordId, authorNickname, authorPassword);

    return res.status(200).json({
      message: "운동 기록이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
