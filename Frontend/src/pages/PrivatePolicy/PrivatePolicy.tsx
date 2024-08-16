import React from 'react';
import styles from './PrivatePolicy.module.scss';
import { Link } from 'react-router-dom';

const PrivatePolicy: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to={'/home'}>
          <img
            className={styles.logo}
            src={'/icon/voss_logo.png'}
            alt={'voss_logo'}
          />
        </Link>
      </header>
      <main className={styles.content}>
        <h1 className={styles.title}>개인정보처리방침</h1>
        <div className={styles.policyContainer}>
          <div className={styles.policyHeader}>
            <h2>개인정보처리방침</h2>
            <p>쉽고 편리한 온라인 서비스를 제공하겠습니다.</p>
          </div>

          <div className={styles.policyContent}>
            <ol>
              <li className={styles['section']}>
                <h3>제1조 총칙</h3>
                <p>
                  VOSS(이하 "회사")는 고객님의 개인정보를 소중하게 생각하고
                  고객님의 개인정보를 효과적으로 관리하고 안전하게 보호하기
                  위하여 최선의 노력을 다 하고 있습니다. 회사는 『개인정보
                  보호법』과 개인정보보호 관련 각종 법규를 준수하고 있습니다.
                  또한 개인정보처리방침을 제정하여 이를 준수하고 있으며, 본
                  처리방침을 홈페이지(https://voss.com)에 공개하여 고객님께서
                  언제나 쉽게 열람하실 수 있도록 하고 있습니다.
                </p>
                <ol>
                  <li>
                    개인정보란 생존하는 개인에 관한 정보로서 다음의 정보를
                    포함합니다.
                    <div>
                      <p>
                        가. 성명, 전화번호 및 이메일 등을 통하여 개인을 알아볼
                        수 있는 정보
                      </p>
                      <p>
                        나. 해당 정보만으로는 특정 개인을 알아볼 수 없어도 다른
                        정보와 쉽게 결합하여 알아볼 수 있는 정보
                      </p>
                    </div>
                  </li>
                </ol>
              </li>

              <li className={styles['section']}>
                <h3>제2조 개인정보의 수집∙이용 목적, 항목 및 보유 기간</h3>
                <ol>
                  <li>
                    회사는 VOSS 서비스 이용을 위하여 필요한 범위에서 최소한의
                    개인정보만을 수집합니다.
                  </li>
                </ol>
              </li>

              <li className={styles['section']}>
                <h3>제3조 개인정보의 수집방법</h3>
                <p>회사는 다음과 같은 방법으로 개인정보를 수집합니다.</p>
                <div>
                  <p>
                    가. 홈페이지(https://voss.com) 회원가입시 성명, 연락처,
                    이메일 등의 정보를 입력받습니다.
                  </p>
                </div>
              </li>
              <li className={styles['section']}>
                <h3>제4조 개인정보의 보유 및 이용기간</h3>
                <ol>
                  <li>
                    회사는 고객님의 개인정보를 아래 기간 동안에 한하여 보유하고
                    이를 이용합니다.
                    <div>
                      <p>가. 에이블스쿨 전체 교육과정 종료 시까지 </p>
                      <p>나. 법령에서 특별한 기간을 규정하여 보관하는 경우</p>
                      <p>
                        ※예시: 상법'에 따른 상업장부와 영업에 관한 중요서류에
                        포함된 개인정보(10년), '통신비밀보호법'에 따른
                        통신사실확인자료 제공 관련(12개월 또는 3개월),
                        '전자상거래등에서의 소비자보호에 관한 법률'에 따른
                        표시/광고에 관한 기록(6개월), 계약 또는 청약철회 등에
                        관한 기록, 대금결제 및 재화 등의 공급에 관한 기록(5년),
                        소비자의불만 또는 분쟁처리에 관한 기록(3년), '신용정보의
                        이용 및 보호에 관한 법률'에 따른 신용정보의 수집/처리 및
                        이용 등에 관한 기록(3년) 등이 해당됩니다.
                      </p>
                    </div>
                  </li>
                </ol>
              </li>
              <li className={styles['section']}>
                <h3>제5조 개인정보의 파기절차 및 방법</h3>
                <p>
                  회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는
                  해당 정보를 지체 없이 파기합니다. 파기절차 및 방법은 다음과
                  같습니다.
                </p>
                <br />
                <ol>
                  <li>
                    파기절차
                    <div>
                      <p>
                        가. 고객님의 개인정보는 수집 및 이용목적이 달성된 후
                        별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침
                        및 기타 관련 법령에 의한 정보보호 사유(보유 및 이용기간
                        참조)에 따라 일정 기간 저장된 후 파기됩니다.
                      </p>
                      <p>
                        나. 별도 DB로 옮겨진 개인정보는 법률에 의한 경우와
                        재가입시 가입비 면제 대상여부를 확인하는 경우가
                        아니고서는 보유되는 이외의 다른 목적으로 이용되지
                        않습니다.
                      </p>
                    </div>
                  </li>
                  <li>
                    파기방법
                    <div>
                      <p>
                        가. 종이(서면)에 작성·출력된 개인정보 : 분쇄하거나 소각
                        등의 방법으로 파기
                      </p>
                      <p>
                        나. DB 등 전자적 파일 형태로 저장된 개인정보 : 재생할 수
                        없는 기술적 방법으로 삭제
                      </p>
                    </div>
                  </li>
                </ol>
              </li>
              <li className={styles['section']}>
                <h3 className="tit">
                  제8조 이용자 및 법정대리인의 권리와 그 행사 방법
                </h3>
                <ol className="list_style_number">
                  <li>
                    고객님께서는 언제든지 개인정보, 개인정보를 이용하거나
                    제3자에게 제공한 현황, 개인정보 수집∙이용∙제공 등의 동의를
                    한 현황(이하 ‘개인정보 등’이라 합니다)에 대한 열람이나
                    제공을 요구하실 수 있고, 오류가 있는 경우에는 그 정정을
                    요구하실 수 있으며, 개인정보의 수집∙이용∙제공에 대한 동의를
                    철회를 하실 수 있습니다.
                  </li>
                  <li>
                    고객님의 개인정보 등에 대한 열람 및 정정,
                    등록해지(동의철회)를 위해서는 고객님이 지정담당자나
                    고객센터에 요청하여 직접 열람 및 정정(선택적 동의철회 포함),
                    등록해지(동의철회)를 하실 수 있습니다.
                  </li>
                  <li>
                    고객님께서 본인의 개인정보 등에 대한 열람이나 정정을
                    요구하시거나 개인정보 수집∙이용∙제공 등의 동의를 철회하시는
                    경우 고객님의 신분을 증명할 수 있는 주민등록증, 여권,
                    운전면허증(신형) 등의 신분증명(사본)을 제시 받아 본인 여부를
                    확인합니다.
                  </li>
                  <li>
                    고객님의 대리인이 고객님의 개인정보 등에 대한 열람이나
                    정정을 요구하거나 고객님의 개인정보의 수집∙이용∙제공에 대한
                    동의를 철회하는 경우에는 대리 관계를 나타내는 위임장,
                    명의고객님의 인감증명서와 대리인의 신분증명서 등의 증표를
                    제시 받아 적법한 대리인인지 여부를 확인합니다.
                  </li>
                  <li>
                    고객님께서는 개인정보 등의 열람이나 제공을 요청하실 수
                    있으며, 회사는 이러한 요청에 지체 없이 필요한 조치를
                    취합니다.
                  </li>
                  <li>
                    고객님께서 개인정보 등의 오류에 대한 정정을 요청하신
                    경우에는 지체 없이 그 오류를 정정하거나 정정하지 못하는
                    사유를 이용자에게 알리는 등 필요한 조치를 하고, 필요한
                    조치를 할 때까지는 당해 개인정보를 이용 또는 제공하지
                    않습니다. 또한 잘못된 개인정보를 제3자에게 이미 제공한
                    경우에는 정정 처리결과를 제3자에게 지체 없이 통지하여 정정이
                    이루어지도록 하겠습니다. 다만, 다른 법률에 따라 개인정보의
                    제공을 요청 받은 경우에는 그 개인정보를 제공하거나 이용할 수
                    있습니다.
                  </li>
                  <li>
                    회사는 고객님의 요청에 의해 해지 또는 삭제된 개인정보를
                    “개인정보의 보유 및 이용기간”에 명시된 바에 따라 처리하고 그
                    외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.
                  </li>
                </ol>
              </li>
              <li className={styles['section']}>
                <h3 className="tit">
                  제9조 개인정보 자동 수집장치의 설치 운영 및 그 거부에 관한
                  사항
                </h3>
                <p>
                  회사는 홈페이지 운영에 있어 필요 시 고객님의 정보를 찾아내고
                  저장하는 '쿠키(Cookie)'를 운용합니다. 쿠키는 회사의 웹사이트를
                  운영하는데 이용되는 서버가 고객님의 브라우저에 보내는 아주
                  작은 텍스트 파일로서 고객님의 컴퓨터 하드디스크에 저장됩니다.
                  고객님께서는 웹브라우저의 보안 정책을 통해 쿠키에 의한
                  정보수집의 허용 거부 여부를 결정하실 수 있습니다.
                </p>
                <ol className="list_style_number">
                  <li>
                    쿠키에 의해 수집되는 정보 및 이용 목적
                    <div>
                      <p>
                        가. 수집 정보 : ID, 접속IP, 접속로그, 이용 컨텐츠 등
                        서비스 이용정보
                      </p>
                      <p>나. 이용목적</p>
                      <div>
                        <p>ㅇ 고객님의 관심분야에 따라 차별화된 정보를 제공</p>
                        <p>
                          ㅇ 회원과 비회원의 접속 빈도나 방문 시간 등을 분석하여
                          이용자의 취향과 관심분야를 파악하여 타켓(Target)
                          마케팅에 활용(쇼핑한 품목들에 대한 정보와 관심 있게
                          둘러본 품목들에 대한 자취를 추적하여 다음 번 쇼핑 때
                          개인 맞춤 서비스를 제공, 유료서비스 이용 시 이용기간
                          안내, 고객님들의 습관을 분석 등) 및 서비스 개편 등의
                          척도로 활용
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    고객님은 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서
                    웹브라우저에서 옵션을 설정함으로써 쿠키에 의한 정보 수집
                    수준의 선택을 조정하실 수 있습니다.
                    <div>
                      <p>
                        나. 위에 제시된 메뉴를 통해 쿠키가 저장될 때마다 확인을
                        하거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
                        단, 고객님께서 쿠키 설치를 거부하였을 경우 서비스 제공에
                        어려움이 있을 수 있습니다.
                      </p>
                    </div>
                  </li>
                </ol>
              </li>
              <li className={styles['section']}>
                <h3 className="tit">제10조 개인정보의 기술적, 관리적 보호</h3>
                <p>
                  회사는 고객님의 개인정보가 분실, 도난, 유출, 위조∙변조 또는
                  훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적∙관리적
                  대책을 마련하고 있습니다.
                </p>
                <p>[기술적 보호대책]</p>
                <ol className="list_style_number">
                  <li>
                    개인정보는 비밀번호에 의해 보호되며, 중요한 데이터는 파일 및
                    전송 데이터를 암호화하거나 파일 잠금기능(Lock)을 사용하는 등
                    별도 보안기능을 통해 보호되고 있습니다.
                  </li>
                  <li>
                    백신 소프트웨어를 이용하여 컴퓨터바이러스 등에 의한 피해를
                    방지하기 위한 조치를 취하고 있습니다. 백신 소프트웨어는
                    주기적으로 업데이트되며 갑작스런 바이러스가 출현할 경우
                    백신이 나오는 즉시 이를 도입, 적용함으로써 개인정보가
                    침해되는 것을 방지하고 있습니다.
                  </li>
                  <li>
                    네트워크 상의 개인정보 및 개인인증정보를 안전하게 전송할 수
                    있도록 보안장치(SSL)를 채택하고 있습니다.
                  </li>
                  <li>
                    해킹 등에 의해 고객님의 개인정보가 유출되는 것을 방지하기
                    위해, 외부로부터 접근이 통제된 구역에 시스템을 설치하고,
                    침입을 차단하는 장치를 이용하고 있으며, 아울러
                    침입탐지시스템을 설치하여 24시간 침입을 감시하고 있습니다.
                  </li>
                </ol>
                <p>[관리적 보호대책]</p>
                <ol className="list_style_number">
                  <li>
                    회사는 고객님의 개인정보를 안전하게 처리하기 위한
                    내부관리계획을 마련하여 임직원이 이를 숙지하고 준수하도록
                    하고 있으며 준수 여부를 주기적으로 점검하고 있습니다.
                  </li>
                  <li>
                    회사는 고객님의 개인정보를 처리할 수 있는 자를 최소한으로
                    제한하고 접근 권한을 관리하며, 새로운 보안 기술 습득 및
                    개인정보보호 의무 등에 관해 정기적인 사내 교육과 외부
                    위탁교육을 통하여 법규 및 정책을 준수할 수 있도록 하고
                    있습니다. 고객님의 개인정보를 처리하는 자는 다음과 같습니다.
                    <div>
                      <p>
                        가. 고객님을 직·간접적으로 상대하여 마케팅 업무를
                        수행하는 자
                      </p>
                      <p>
                        나. 개인정보보호책임자 및 개인정보보호담당자 등 개인정보
                        관리 및 개인정보보호 업무를 담당하는 자
                      </p>
                      <p>다. 기타 업무상 개인정보의 처리가 불가피한 자</p>
                    </div>
                  </li>
                  <li>
                    신규직원 채용 시 그리고 연 1회 전 임직원이 정보보호서약서에
                    서명하게 함으로써 직원에 의한 정보(개인정보 포함) 유출을
                    사전에 방지하고, 수시로 개인정보보호 의무를 상기시키며 준수
                    여부를 감사하기 위한 내부 절차를 마련하여 시행하고 있습니다.
                  </li>
                  <li>
                    개인정보 취급자의 업무 인수인계는 보안이 유지된 상태에서
                    철저하게 이뤄지고 있으며, 입사 및 퇴사 후 개인정보
                    침해사고에 대한 책임을 명확하게 규정하고 있습니다.
                  </li>
                  <li>
                    회사는 전산실 및 자료보관실 등을 통제구역으로 설정하여
                    출입을 통제합니다.
                  </li>
                  <li>
                    서비스 이용계약 체결 또는 서비스 제공을 위하여 고객님의
                    은행결제계좌, 신용카드번호 등 대금결제에 관한 정보를
                    수집하거나 고객님께 제공하는 경우 당해 고객님이 본인임을
                    확인하기 위하여 필요한 조치를 취하고 있습니다.
                  </li>
                  <li>
                    회사는 고객님 개인의 실수나 기본적인 인터넷의 위험성 때문에
                    일어나는 일들에 대해 책임을 지지 않습니다. 고객님의
                    개인정보를 보호하기 위해서 자신의 ID와 비밀번호를 철저히
                    관리하고 책임을 져야 합니다.
                  </li>
                </ol>
              </li>
              <li className={styles['section']}>
                <h3 className="tit">제11조 개인정보 보호책임 부서 및 연락처</h3>
                <p>
                  회사는 고객님의 개인정보를 보호하고 개인정보와 관련한 불만 및
                  문의사항을 처리하기 위하여 아래와 같이 관련 부서를 지정하여
                  운영하고 있습니다. 또한 고객님의 의견을 매우 소중하게
                  생각합니다. 고객님께서 회사 서비스의 개인정보 관련 문의사항이
                  있을 경우 아래 개인정보 보호책임자 및 담당자에게 문의하시면
                  신속하고 성실하게 답변을 드리겠습니다.
                </p>
                <ol className="list_style_number">
                  <li>
                    개인정보 보호책임 부서 및 연락처
                    <div>
                      <p>
                        가. 회사 개인정보 보호책임자 : KT 인재실 진영심 상무
                      </p>
                      <p>ㅇ 전화번호: 02-0000-0000</p>
                      <p>ㅇ 이메일 : VOSS@voss.com</p>
                      <p>
                        나. 회사 개인정보 보호담당자 : VOSS 인재실 송하림 대리
                      </p>
                      <p>ㅇ 전화번호: 02-0000-0000</p>
                      <p>ㅇ 이메일 : VOSS@voss.com</p>
                    </div>
                  </li>
                </ol>
              </li>
              <li className={styles['section']}>
                <h3 className="tit">제12조 개인정보 열람청구</h3>
                <p>
                  회사는 고객님의 의견을 매우 소중하게 생각합니다. 고객님께서
                  문의사항이 있을 경우 회사의 대리점, 플라자를 방문하시거나
                  고객센터 등에 전화로 문의하시면 신속, 정확한 답변을
                  드리겠습니다.
                </p>
                <ol className="list_style_number">
                  <li>
                    전화번호
                    <div>
                      <p>
                        국번없이 100(자사 이용 시, 무료), 1588-0010(타사 이용
                        시, 유료)
                      </p>
                    </div>
                  </li>
                  <li>
                    온라인상담 : kt.com(http://www.kt.com)에 접속하신 후
                    '고객센터 - 자주하는 질문/상담 - 이메일상담'에서 상담사에게
                    문의하실 수 있습니다.
                  </li>
                  <li>
                    기타 개인정보 침해에 대한 신고나 상담이 필요하신 경우에는
                    아래 기관에 문의하시기 바랍니다.
                    <div>
                      <p>가. 개인정보 침해신고센터(한국인터넷진흥원 운영)</p>
                      <div>
                        <p>ㅇ 소관업무 : 개인정보 침해사실 신고, 상담 신청</p>
                        <p>
                          ㅇ 홈페이지/전화 : http://privacy.kisa.or.kr /
                          (국번없이)118
                        </p>
                      </div>
                      <p>나. 개인정보 분쟁조정위원회</p>
                      <div>
                        <p>
                          ㅇ 소관업무 : 개인정보 분쟁조정신청, 집단분쟁조정
                          (민사적 해결)
                        </p>
                        <p>
                          ㅇ 홈페이지/전화 : www.kopico.go.kr / (국번없이)
                          1833-6972
                        </p>
                      </div>
                      <p>
                        다. 대검찰청 사이버수사과 : www.spo.go.kr / (국번없이)
                        1301
                      </p>
                    </div>
                  </li>
                  <li>
                    회사는 고객님의 개인정보 열람 청구를 위하여 아래와 같이 관련
                    부서를 지정하여 운영하고 있습니다. 고객님께서 회사서비스에
                    개인정보 열람을 청구하실 경우 아래 부서 담당자에게
                    문의하시면 신속하고 성실하게 답변 드리겠습니다.
                    <div>
                      <p>[회사 개인정보 열람청구 접수∙처리 부서]</p>
                      <div>
                        <p>가. 담당자 : 이솔 담당자</p>
                        <p>나. 연락처 : 02-0000-0000, VOSS@voss.com</p>
                      </div>
                    </div>
                  </li>
                </ol>
              </li>
              <li className={styles['section']}>
                <h3 className="tit">제13조 권익침해 구제방법</h3>
                <p>
                  기타 개인정보 침해에 대한 신고나 상담이 필요하신 경우에는 아래
                  기관에 문의하여 주시기 바랍니다.
                </p>
                <ol className="list_style_number">
                  <li>
                    개인정보 침해신고센터 (한국인터넷진흥원 운영)
                    <div>
                      <p>가. 소관업무 : 개인정보 침해사실 신고, 상담 신청</p>
                      <p>
                        나. 홈페이지/전화 : http://privacy.kisa.or.kr /
                        (국번없이) 118
                      </p>
                    </div>
                  </li>
                  <li>
                    개인정보 분쟁조정위원회
                    <div>
                      <p>
                        가. 소관업무 : 개인정보 분쟁조정신청, 집단분쟁조정
                        (민사적 해결)
                      </p>
                      <p>
                        나. 홈페이지/전화 : www.kopico.go.kr / (국번없이)
                        1833-6972
                      </p>
                    </div>
                  </li>
                  <li>
                    대검찰청 사이버수사과 : www.spo.go.kr / (국번없이) 1301
                  </li>
                  <li>
                    경찰청 사이버안전국 : https://ecrm.police.go.kr / (국번없이)
                    182
                  </li>
                </ol>
              </li>
              <li className={styles['section']}>
                <h3>제14조 개인정보처리방침 고지</h3>
                <ol>
                  <li>
                    홈페이지 개인정보처리방침 공고/시행일자
                    <div>
                      <p>가. 공고일자 : [2023/08/01]</p>
                      <p>나. 시행일자 : [2023/08/01]</p>
                    </div>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivatePolicy;
