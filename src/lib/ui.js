import $ from "jquery";
import { passiveFalse } from "./passiveFalse";

export const modalUI = {
	// 모달창 오픈
	open(target) {
		$(target).removeClass("delay").show().addClass("active");
	},
	// 모달창 닫기
	close(target) {
		if (!$(target).hasClass("active")) $(target).hide();
		else {
			$(target).removeClass("active").addClass("delay");
			setTimeout(() => {
				$(target).hide();
			}, 300);
		}
	},
};

// viewport height 변화할 떄 높이 계산 => 모바일텍스트입력창 나올 때 같은
export const updateViewportHeight = () => {
	if ("visualViewport" in window) {
		const currentHeight = window.visualViewport.height; // 키보드로 인해 줄어든 높이
		const vh = currentHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	} else {
		const vh = window.innerHeight * 0.01; // 1%의 높이 계산
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	}
	// const vh = 395 * 0.01; // 1%의 높이 계산
	// const vh = event.target.height * 0.01;
	// console.log(vh);
	// document.documentElement.style.setProperty('--vh', `${vh}px`);
	/* setTimeout(() => {

	}, 500);
	requestAnimationFrame(() => {
    }); */
};

// 날짜 구분선 필요한지
export const isdivivedDate = (currentDate, previousDate) => {
	if (!previousDate) return true; // 첫 번째 항목은 무조건 새 날짜
	const current = new Date(currentDate).getDate();
	const previous = new Date(previousDate).getDate();
	// 날짜 차이 계산
	return current > previous;
};
// 스크롤이 없음/안생김
export const not_scroll = (chatWrap_ele) => {
	let scrHeight = chatWrap_ele.scrollHeight;
	let height = chatWrap_ele.clientHeight;
	// 스크롤 없으면 작동X
	if (height == scrHeight) return true;
	else return false;
};
// 읽어야하는 곳으로 스크롤
export const scroll_move_read = (element, chatWrap_ele) => {
	if (chatWrap_ele && element) {
		const chatWrapRect = chatWrap_ele.getBoundingClientRect();
		const dividerRect = element.getBoundingClientRect();
		// `divider`의 중심이 `chatWrap`의 중심에 오도록 스크롤 조정
		const scrollTopOffset =
			dividerRect.top - chatWrapRect.top - (chatWrap_ele.clientHeight / 2 - element.clientHeight / 2);
		// 스크롤 위치 설정
		chatWrap_ele.scrollTop += scrollTopOffset;
	}
};
// 채팅창 가장 아래 스크롤
export const scroll_move_last = (chatWrap_ele) => {
	if (chatWrap_ele) chatWrap_ele.scrollTop = chatWrap_ele.scrollHeight;
};
// 현재 채팅창 스크롤이 가장 하단과 가까움
export const chat_scroll_near_last = (chatWrap_ele) => {
	if (chatWrap_ele) {
		return chatWrap_ele.scrollTop >= chatWrap_ele.scrollHeight - chatWrap_ele.clientHeight - 100;
	}
};
// 답장글로 갈 때 위아래로 흔들어주기
const shake_time_index = {};
export const shake_message = (id) => {
	clearTimeout(shake_time_index[id]);
	const element = document.getElementById(id);
	if (element) {
		element.querySelectorAll(".chat-bubble")[0].classList.remove("shake");
		setTimeout(() => {
			element.querySelectorAll(".chat-bubble")[0].classList.add("shake");
		}, 10);
		shake_time_index[id] = setTimeout(() => {
			element.querySelectorAll(".chat-bubble")[0].classList.remove("shake");
		}, 2000);
	}
};
// 메인 마지막 스크롤 저장
export const get_main_last_scroll = () => {
	return document.documentElement.scrollTop;
};
// 메인 마지막 스크롤 저장
export const set_main_last_scroll = (scr) => {
	document.documentElement.scrollTop = scr;
};
