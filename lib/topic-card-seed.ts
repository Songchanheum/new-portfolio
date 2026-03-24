/** 마지막 카드(topic / card-4) 시드 — Supabase 마이그레이션·폴백 데이터와 동기 유지 */
export const TOPIC_CARD_KEYWORD =
  'AI 가치와 사용자 경험에 대한 기술적 지향점'

/** 모달 상단 keyword와 중복되지 않도록 본문만 (h1·최상위 div 없음) */
export const TOPIC_CARD_DETAIL_HTML = `
<p><strong>AI는 도구가 아니라 협업자입니다.</strong> 기술이 인간에게 어떻게 느껴져야 하는지를 설계하고, 경계를 넘나들며 실행하는 개발자로서의 철학을 공유합니다.</p>

<hr />

<section>
  <h2>1. 도구를 넘어선 협업자로서의 AI</h2>
  <p>AI가 단순히 명령을 수행하는 도구에 머무는 한, 진짜 가치는 드러나지 않습니다. <strong>AI와 함께 사고하고, 함께 만들고, 그 과정 자체를 사용자에게 체감시키는 것</strong>이 저의 목표입니다.</p>
  <ul>
    <li><strong>상호작용의 재설계:</strong> 일방향적 지시가 아닌 피드백이 오가는 파트너십 구축</li>
    <li><strong>가치의 구체화:</strong> 결과물뿐만 아니라 결과에 도달하는 논리적 과정의 시각화</li>
  </ul>
</section>

<section>
  <h2>2. 무의식적 몰입을 돕는 경험 설계</h2>
  <p>좋은 기술은 사용자가 기술의 존재를 의식하지 못할 때 완성됩니다. <strong>인터페이스의 무게, 반응의 속도, 전환의 리듬</strong> — 눈에 보이지 않는 디테일이 사용자의 전체 경험을 결정합니다.</p>
  <ul>
    <li><strong>인터페이스의 무게:</strong> 사용자가 느끼는 심리적 부담의 최소화</li>
    <li><strong>반응의 속도:</strong> 사고의 흐름이 끊기지 않는 즉각적인 피드백</li>
    <li><strong>전환의 리듬:</strong> 기능과 기능 사이의 매끄러운 연결성</li>
  </ul>
</section>

<section>
  <h2>3. 전 영역을 넘나들며 공백을 채우는 개발자</h2>
  <p>프론트엔드부터 백엔드, 인프라까지 필요한 곳이면 어디든 뛰어듭니다. <strong>AI를 단순한 도구가 아니라 사고의 확장으로 활용</strong>하며, 팀 내에서 비어 있는 역할을 스스로 찾아 채웁니다.</p>
  <table>
    <thead>
      <tr>
        <th>분류</th>
        <th>역량 및 지향점</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>기술적 범위</strong></td>
        <td>프론트엔드, 백엔드, 인프라 전 영역을 아우르는 실행력</td>
      </tr>
      <tr>
        <td><strong>AI 활용 능력</strong></td>
        <td>단순 구현을 넘어 문제 해결을 위한 사고의 확장판으로 활용</td>
      </tr>
      <tr>
        <td><strong>팀 내 역할</strong></td>
        <td>프로젝트의 성공을 위해 필요한 지점을 선제적으로 파악 및 해결</td>
      </tr>
    </tbody>
  </table>
</section>
`.trim()
