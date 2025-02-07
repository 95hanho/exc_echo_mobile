// API 엔드포인트 목록 - API url 모음집
// const API_ENDPOINTS = {
const API_URL = {
	// 테스트
	TEST: "http://localhost:9371/test", // GET
	TESTLOGIN: "http://localhost:9371/auth/login", // 로그인
	TESTTOKEN: "http://localhost:9371/auth/token", // 토큰
	TESTUSER: "http://localhost:9371/auth", // 유저 정보
	TEST_FILEUPLOAD: "http://localhost:9371/file", // 파일업로그
	TEST_FILEDOWNLOAD: "http://localhost:9371/file", // 파일다운로드
	TEST_MYFILE: "http://localhost:9371/file/myfile", // 내 파일이름가져오기
	/* 인증 */
	USER: "/auth", // 로그인, 유저정보 가져오기
	TOKEN: "/auth/token", // 토큰 리토큰
	/* 메인화면 */
	ECHO_LIST: "/main", // 교육프로그램 목록조회
	ECHO_SEARCH: "/main/search", // 교육프로그램 검색
	// ECHO_FIX: "/main", // 교육프로그램 상단 고정
	/* 채팅창 */
	CHAT: "/chat", // 채팅창 불러오기, 채팅입력, 채팅 반응하기
	CHAT_FILE: "/chat/file", // 파일업로드
	// CHAT_FILE: "/chat/file", // 채팅 첨부파일 첨가
	// 채팅창 더보기 - 참여인력
	GROUP: "/plus/group", // 참여인력 불러오기
	// 채팅창 더보기 - 니즈
	NEEDS: "/plus/needs", // 니즈 불러오기
	// 채팅창 더보기 - 과정개요
	ECHO_OUTLINE: "/plus/outline",
	// 채팅창 더보기 - 첨부파일
	FILE: "/plus/file", // 첨부파일 목록 불러오기
	FILE_DOWNLOAD: "/plus/file-download", // 첨부파일 다운로드
	// 채팅창 더보기 - 참고문건
	DOCUMENT: "/plus/document",
};

export default API_URL;
