import LessonParts from "./LessonParts";
export default function MoveItVersions({ part }: { part?: number }) {
  return (
    <div className="moveit-versions">
      <LessonParts name="moveit-versions" part={part}>
        <table className="moveit-version-table">
          <caption>함께 사용하는 ROS 환경이 달라요.</caption>
          <thead>
            <tr>
              <th scope="col">구분</th>
              <th scope="col">MoveIt 1</th>
              <th scope="col">MoveIt 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">함께 사용하는 환경</th>
              <td data-version="MoveIt 1">ROS 1</td>
              <td data-version="MoveIt 2">ROS 2</td>
            </tr>
            <tr>
              <th scope="row">대표적인 ROS 버전</th>
              <td data-version="MoveIt 1">Noetic</td>
              <td data-version="MoveIt 2">Humble, Jazzy 등</td>
            </tr>
            <tr>
              <th scope="row">화면 도구</th>
              <td data-version="MoveIt 1">RViz</td>
              <td data-version="MoveIt 2">RViz2</td>
            </tr>
            <tr>
              <th scope="row">핵심 기능</th>
              <td data-version="MoveIt 1">IK, 충돌 검사, 경로·궤적 계획</td>
              <td data-version="MoveIt 2">
                같은 핵심 기능을 ROS 2 환경에서 제공
              </td>
            </tr>
          </tbody>
        </table>
        <p className="moveit-version-summary">
          로봇 팔을 움직이는 도구를 ROS 2 환경에 맞게 옮기고 발전시킨 것이
          MoveIt 2예요.
        </p>
        <p>
          설치 방법과 실행 명령, 코드·설정 방식이 달라서 학습 자료도 버전에 맞춰
          봐야 해요.
        </p>
        <p className="moveit-version-support">
          현재 공식 사이트는 MoveIt 1의 Noetic 버전을 지원 종료로 안내하고
          있어요.{" "}
          <a className="text-link" href="https://moveit.ai/install/">
            공식 지원 종료 안내
          </a>
        </p>
        <div className="moveit-version-choice">
          <h3>이 프로젝트에서는 MoveIt 2를 배워요.</h3>
          <p>
            지금 공부하는 프로젝트는 ROS 2 Jazzy를 사용해요. Jazzy 환경에 맞는
            MoveIt 2 자료를 보면 됩니다.
          </p>
        </div>
        <a
          className="text-link moveit-version-reference"
          href="https://moveit.picknik.ai/main/index.html"
        >
          MoveIt 2 공식 설명 읽기
        </a>
      </LessonParts>
    </div>
  );
}
