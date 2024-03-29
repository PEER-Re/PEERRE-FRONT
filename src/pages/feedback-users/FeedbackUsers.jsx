import { useState, useEffect } from "react";
import axios from "axios";
import {
  MainContainer,
  HeaderBox,
  ProfImg,
  ProfName,
  MyName,
  ProfileContainer,
  ProfileContainer_Inner,
  MemberList,
  MemebrBtn,
} from "/src/styles/style";
import FeedbackBlock from "/src/components/feedback-users/FeedbackBlock.jsx";
import ProjectIdStore from "/src/stores/projectId/ProjectIdStore";
import TeamSpaceStore from "/src/stores/teamSpace/TeamSpaceStore";
import FeedbacksStore from "/src/stores/feedback/FeedbackStore";

const yesData = [
  { comment: "연락이 잘 돼요." },
  { comment: "시간약속을 잘 지켜요." },
  { comment: "능력이 뛰어나요" },
  { comment: "말을 조리있게 잘 해요." },
  { comment: "빈틈이 없어요" },
  { comment: "친절해요." },
  { comment: "최선을 다해요." },
  { comment: "긍정적인 태로를 지녔어요." },
  { comment: "매너가 있어요." },
];

const noData = [
  { comment: "연락이 안 돼요." },
  { comment: "시간약속을 안 지켜요." },
  { comment: "능력이 부족해요." },
  { comment: "말을 조리있게 못해요." },
  { comment: "빈틈이 있어요" },
  { comment: "불친절해요" },
  { comment: "최선을 다하지 않아요." },
  { comment: "부정적인 태로를 지녔어요." },
  { comment: "매너가 없어요." },
];

function FeedbackUsers() {
  const accessToken = localStorage.getItem("accessToken");

  const selectedPRId = ProjectIdStore((state) => state.selectedPRId); // 프로젝트 id
  const selectedUser = FeedbacksStore((state) => state.selectedUser); // 선택 유저
  const { setTeamMembers } = TeamSpaceStore((state) => state);
  const { setSelectedUser} = FeedbacksStore((state) => state);

  const [profileNameApi, setProfileNameApi] = useState("");
  const [profileImgApi, setProfileImgApi] = useState("");
  const [teamName, setTeamName] = useState("");
  const [noNumberArray, setNoNumberArray] = useState([]);
  const [yesNumberArray, setYesNumberArray] = useState([]);
  const [updateTime, setUpdateTime] = useState("");
  const [members, setMembers] = useState([]);

// 팀 정보 받아오기
    const getTeamInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_SERVER_HOST}/api/projects/${selectedPRId}/team-report`, {
          headers: {
            'Authorization': accessToken,
          }
        });
        console.log('성공 : ',response.data.data);
        setTeamMembers(response.data.data.teamInfo.teamUserNames); // team member 저장
        setMembers(response.data.data.teamInfo.teamUserNames);
      } catch(error) {
        console.log(error);
      }
  }


  useEffect(() => {
    // 페이지 렌더링 시 GET 요청 보내기
    sendGetRequest();
    getTeamInfo();
    setUpdateTime(getCurrentTime());
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  };

  const sendGetRequest = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_SERVER_HOST
        }/api/projects/${selectedPRId}/my-report`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
        }
      );

      console.log('response : ', response);
      const userInfo = response.data.data.userInfo;
      setProfileNameApi(userInfo.nickname);
      setProfileImgApi(userInfo.profileImageUrl);
      setTeamName(userInfo.teamName);
      const NoData = response.data.data.noFeedbackInfo;
      const YesData = response.data.data.yesFeedbackInfo;

      // 배열 초기화
      const noNumberArray = [];
      const yesNumberArray = [];

      for (const key in NoData) {
        if (key.includes("Num")) {
          noNumberArray.push(NoData[key]);
        }
      }

      for (const key in YesData) {
        if (key.includes("Num")) {
          yesNumberArray.push(YesData[key]);
        }
      }

      setNoNumberArray(noNumberArray);
      setYesNumberArray(yesNumberArray);
    } catch (error) {
      console.error(error.message);
    }
  };

  const changeUser = (index) => {
    setSelectedUser(index); // 선택한 유저 변경
    console.log('유저 번경  : ', index);
  }

  return (
    <MainContainer>
      <HeaderBox>피드백 관리</HeaderBox>
      <ProfileContainer>
        <ProfileContainer_Inner>
          <ProfImg src={profileImgApi} />
          <ProfName>
            <MyName>{profileNameApi}</MyName>
          </ProfName>
        </ProfileContainer_Inner>
        <MemberList>
          {members.map((item, index) => (
            <MemebrBtn key={index} onClick={() => changeUser(index)}>{item}</MemebrBtn>
          ))}
        </MemberList>
      </ProfileContainer>
      <FeedbackBlock yesData={yesData} noData={noData} />
    </MainContainer>
  );
}

export default FeedbackUsers;
