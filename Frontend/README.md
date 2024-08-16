# 현재 url 기록🫶
- / : 로그인 화면
- /home : 상담자메인화면
- /notice : 공지사항페이지
- /notice/write :공지사항작성 페이지
- /dashboard : 대시보드 페이지
- /mypage : 마이페이지
- /admin : 관리자 메인페이지
- /admin/consultant : 상담사관리페이지
- /admin/client/caution : 주의고객관리페이지
- /call : 전화중(상담중)일때 페이지
- /callnote/:id :이전상담내역 페이지(/call을 통해 들어갈수있다.)
- /callnoteDetail/:id : 이전상담내역 세부기록 (모달형태, callnote/:id 에서 들어갈수있다.)
- accounts/signup-agree  : 회원가입 동의페이지
- accounts/signup : 회원가입페이지
- accounts/reset_password : 비밀번호 재설정 페이지

## Naming Convention
- 함수, 변수 ⇒ Camel Case ( sendAPI )
- Component ⇒ Pascal ( HomePage )
- 상수 ⇒ upper ( MAX_NUM )
- css ⇒ Kebab ( main-container )


## git convention
- commit layout
```shell
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
- **type**
    1. feat: 새로운 기능
    2. fix: 버그 수정
    3. docs: 문서 변경
    4. style: 코드 포맷팅, 세미콜론 누락 등
    5. refactor: 코드 리팩토링
    6. test: 테스트 코드
    7. chore: 빌드 작업 수정, 패키지 매니저 설정 등
- **제목 작성**
    1. 현재 시제 사용 ("change" 사용, "changed" 사용 안 함)
    2. 첫 글자 대문자 사용하지 않음
    3. 끝에 마침표 사용하지 않음  
 - **본문(Body)**:
    1. 현재 시제 사용
    2. 변경 이유와 이전 동작과의 차이점 설명
- **꼬리말(Footer)**:
    1. Breaking changes 명시
    2. 해결된 이슈 언급 (예: "Closes #123, #245")
- 기타 규칙:
    1. 모든 줄은 100자를 넘지 않도록 함
    2. 중요하지 않은 커밋(포맷팅, 누락된 세미콜론 등)은 'irrelevant' 키워드로 표시하여 git bisect 시 무시할 수 있게 함
       

## branch convention
- feat
    - feat/{기능명}


## TDD
- Jest
- React Testing Library: React Component Test Library
```shell
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```
- TDD 사이클 따르기:
    - Red: 실패하는 테스트 작성
    - Green: 테스트를 통과하는 최소한의 코드 작성
    - Refactor: 코드 개선

1. 컴포넌트 테스트 작성 예시:
    
    ```jsx
    import React from 'react';
    import { render, screen } from '@testing-library/react';
    import Button from './Button';
    
    test('renders button with correct text', () => {
      render(<Button text="Click me" />);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });
    
    ```

2. 기능 테스트 작성:
    
    ```jsx
    import { fireEvent, render, screen } from '@testing-library/react';
    import Counter from './Counter';
    
    test('increments counter when button is clicked', () => {
      render(<Counter />);
      const button = screen.getByText('Increment');
      fireEvent.click(button);
      expect(screen.getByText('Count: 1')).toBeInTheDocument();
    });
    
    ```

3. 모킹과 비동기 테스트:
    
    ```jsx
    import { render, screen, waitFor } from '@testing-library/react';
    import axios from 'axios';
    import UserList from './UserList';
    
    jest.mock('axios');
    
    test('fetches and displays users', async () => {
      axios.get.mockResolvedValue({ data: [{ id: 1, name: 'John' }] });
      render(<UserList />);
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument();
      });
    });
    
    ```

4. 스냅샷 테스트:
    
    ```jsx
    import renderer from 'react-test-renderer';
    import Button from './Button';
    
    test('Button components matches snapshot', () => {
      const tree = renderer.create(<Button text="Click me" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    
    ```
5. 테스트 실행:
`package.json`에 스크립트 추가:

    실행: `npm test` 또는 `npm run test:watch`
   
      ```json
      "scripts": {
        "test": "jest",
        "test:watch": "jest --watch"
      }
      
      ```
7. 지속적 통합(CI) 설정:
GitHub Actions나 Travis CI 등을 사용하여 모든 PR에 대해 자동으로 테스트 실행


- TDD를 실패할 때의 팁:
  - 작은 단위로 시작하여 점진적으로 확장
  - 테스트 커버리지 도구 사용 (Jest에 내장)
  - 단위 테스트, 통합 테스트, E2E 테스트를 적절히 조합
  - 테스트 가능한 코드 작성 (의존성 주입, 관심사 분리 등)
 
## CSS
- SCSS
