// 화면 높이 업데이트 함수
function adjustHeight() {
	// visualViewport 사용
	if (window.visualViewport) {
		const currentHeight = window.visualViewport.height; // 키보드로 인해 줄어든 높이
		const vh = currentHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	} else {
		// visualViewport가 지원되지 않는 경우 fallback
		const currentHeight = window.innerHeight;
		const vh = currentHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	}
}

// 이벤트 리스너 등록
if (window.visualViewport) {
	window.visualViewport.addEventListener("resize", adjustHeight); // visualViewport 이벤트 리스너
} else {
	window.addEventListener("resize", adjustHeight); // window resize 이벤트 리스너
}

// 초기 실행 (앱 로드 시)
adjustHeight();
