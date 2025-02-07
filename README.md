# 사용설명서

## 기본 세팅 

> nodejs 설치

> 패키지 파일들 설치
> - cd ./프로젝트명
>
> - npm install

## 실행

npm run dev => 로컬 API와 연결(안써도됨)
npm run dev -- --port 5173 => port5173으로 로컬실행  
* API쪽 CORS 확인필요 => localhost:5173, 5174, 5175/ 열려있음  
npm run dev:test => 테스트 도메인 API와 연결
npm run dev:real => 실제 도메인 API와 연결


## 빌드

npm run build
후에 '/dist'의 파일들 'm.echo.exc.co.kr'에 복사/덮어쓰기    
npm run build:test  
후에 '/test'의 파일들 'm.echo.exc.co.kr/test'에 복사/덮어쓰기    

npm unr build
