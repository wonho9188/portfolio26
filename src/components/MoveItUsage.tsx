import LessonParts from "./LessonParts";
export default function MoveItUsage({ part }: { part?: number }) {
  return (
    <div className="moveit-usage">
      <LessonParts name="moveit-usage" part={part}>
        <h3>설치해서 쓰는 프로그램인가요?</h3>
        <p className="moveit-usage-intro">
          네, 설치해서 쓰는 소프트웨어예요. 포토샵이나 프리미어 프로처럼 하나의
          앱 안에서 모든 작업을 하기보다는, ROS 2와 함께 사용하는 로봇용 도구
          모음에 가까워요.
        </p>

        <div className="moveit-usage-method">
          <h4 hidden={part !== undefined}>화면에서 사용하기</h4>
          <p>
            <code>RViz</code>라는 로봇 시각화 화면에 MoveIt 기능을 붙여
            사용해요.
          </p>
          <ol className="moveit-usage-steps">
            <li>로봇 모델을 불러와요.</li>
            <li>마우스로 손의 목표 위치와 방향을 정해요.</li>
            <li>
              <code>Plan</code>을 눌러 움직임을 계산하고 미리 봐요.
            </li>
            <li>실행을 요청하면 연결된 시뮬레이터나 로봇이 움직여요.</li>
          </ol>
          <a
            className="text-link"
            href="https://moveit.picknik.ai/main/doc/tutorials/quickstart_in_rviz/quickstart_in_rviz_tutorial.html"
          >
            공식 화면 예제 보기
          </a>
        </div>
        <div className="moveit-usage-method">
          <h4 hidden={part !== undefined}>코드에서 사용하기</h4>
          <p>
            Python이나 C++ 프로그램에서 목표를 보내 MoveIt을 사용할 수도 있어요.
          </p>
          <div
            className="moveit-code-flow"
            aria-label="코드로 MoveIt을 사용하는 흐름"
          >
            <span>Python / C++ 프로그램</span>
            <span>손의 목표를 MoveIt에 전달</span>
            <span>움직임 계획 계산·실행 요청</span>
          </div>
          <p>
            공부 중인 자료의 Pick &amp; Place 스킬이 MoveIt을 호출하는 방식도
            여기에 해당해요.
          </p>
          <a
            className="text-link"
            href="https://moveit.picknik.ai/main/doc/examples/motion_planning_python_api/motion_planning_python_api_tutorial.html"
          >
            공식 Python 예제 보기
          </a>
        </div>

        <div className="moveit-usage-analogy">
          <h4>엔진과 화면으로 생각해 보세요.</h4>
          <dl>
            <div>
              <dt>MoveIt</dt>
              <dd>움직임을 계산하는 엔진</dd>
            </div>
            <div>
              <dt>RViz</dt>
              <dd>그 계산을 눈으로 보고 조작하는 화면</dd>
            </div>
          </dl>
        </div>
      </LessonParts>
    </div>
  );
}
