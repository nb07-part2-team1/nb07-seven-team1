// 그룹 crud 만들고 지우고 수정하고 조회하는 api
// 만들어야할것  post , get get , patch , delete
// 유져 id , name , description , photoUrl , discordWebhookUrl, likeCount , tags
// , createdAt, updatedAt,
// 오너  owner id , nickname , createdAt , updatedAt
//  participants id, nickname, createdAt, updatedAt
// 이미지 멀터 만들기
//헬퍼 사용 api 명세를 도저히 복잡해서 여기서는 못따라감
//클래스 사용, 유효성 검사,  완료 스키마 변경요청 .. 안된다면 내꺼 변경 가능성 높은것들 주석표시
//헬퍼js 사용시 api test 잘나오느것 확인
//
import { formatGroupResponse } from "../../utils/helpers.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "../../errors/customError.js";
import { isEntityName } from "typescript";
import { groupEntity } from "../../entitis/groupEntitis.js";
const entity = new groupEntity();

export const createGroup = async (req, res, next) => {
  try {
    const {
      owner_id, /////////////// ////////////////////////////////////////////////////////////
      ownerNickname, ///////////////////////////////////////////////////////////////////////////
      name, ///////////////////////////////////////////////////////////////////////////
      tags,
      goalRep,
      photoUrl,
      password,
      description,
      discordWebhookUrl,
      discordInviteUrl,
    } = req.body;

    if (!owner_id) throw new BadRequestError("아이디를 입력하세요");
    if (!password) throw new BadRequestError("비밀번호를 입력하세요");
    if (!name) throw new BadRequestError("그룹명을 입력하세요");
    if (!ownerNickname) throw new BadRequestError("닉네임을 입력하세요");

    const newGroup = await groupEntity.create({
      data: {
        owner_id, ////////////////////////////////////////////////////////////
        ownerNickname, /////////////////////////////////////////////
        name, ////////////////////////////////////////////////////////////
        tags,
        goalRep,
        photoUrl,
        password,
        description,
        discordWebhookUrl,
        discordInviteUrl,
        like_count: 0,
        participantCount: 1,
      },
    });
    const response = {
      ...formatGroupResponse(newGroup),
      owner: {
        id: owner_id, /////////////////////////////////////////////
        nickname: ownerNickname, /////////////////////////////////////////////
        createdAt: Date.now(), /////////////////////////////////////////////
        updatedAt: Date.now(), /////////////////////////////////////////////
      },
      participants: [],
      badges: [],
    };

    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
};

export const getGroup = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, sortBy, keyword } = req.query;
    let orderBy;
    switch (sortBy) {
      case "mostlike":
        orderBy = { like_count: "desc" };
        break;
      case "mostBadges":
        orderBy = { participantCount: "desc" };
        break;
      case "latest":
      default:
        orderBy = { createdAt: "desc" };
    }
    const where = keyword ? { name: { contains: keyword } } : {};
    const [total, groups] = await groupEntity.getList(
      (Number(page) - 1) * Number(pageSize),
      Number(pageSize),
      where,
      orderBy
    );

    const formattedData = groups.map((group) => formatGroupResponse(group));
    res.status(200).send({
      data: formattedData,
      total: total,
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupDetail = async (req, res, next) => {
  try {
    const where = { ...req.query };

    if (where.id) where.id = Number(where.id);
    if (where.owner_id) where.owner_id = Number(where.owner.id);

    if (Object.keys(where).length === 0) {
      throw new BadRequestError("검색조건을 입력하세요.");
    }
    const group = await groupEntity.findGroup(where);
    if (!group) {
      throw new NotFoundError("그룹을 찾을 수 없음.");
    }

    res.status(200).send(formatGroupResponse(group));
  } catch (error) {
    next(error);
  }
};

export const patchGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { password, ...dataToUpdate } = req.body;

    const group = await groupEntity.findGroup({
      id: Number(groupId), ///////////////
    });

    if (!group) throw new NotFoundError("존재하지 않는 그룹입니다.");
    if (group.password !== password) {
      throw new UnauthorizedError("비밀번호가 틀립니다");
    }
    const updatedGroup = await groupEntity.update(groupId, dataToUpdate);

    res.status(200).send(formatGroupResponse(updatedGroup));
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { ownerPassword } = req.body;

    const group = await groupEntity.findGroup({ id: Number(groupId) });

    if (!group) {
      throw new NotFoundError("그룹이 존재하지 않습니다.");
    }
    if (group.password !== ownerPassword) {
      throw new UnauthorizedError("비밀번호가 틀립니다");
    }
    await groupEntity.delete(groupId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
