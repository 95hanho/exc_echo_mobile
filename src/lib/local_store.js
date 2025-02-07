import { userInfo } from "../store/authSlice";
import { testlog } from "./env";

// ridge, valley, tree 인지 가져오기
export const get_loginType = () => {
	let result = "";
	const abc = userInfo.subscribe((v) => {
		if (v.type) result = v.type;
	});
	abc();
	if (!result) result = localStorage.getItem("type") || "ridge";
	return result;
};
// ridge, valley, tree 인지 저장
export const set_loginType = (type) => {
	localStorage.setItem("type", type);
};
// 검색 타입 가져오기
export const get_search_type = () => {
	return localStorage.getItem("search_type") || "PROJECT_SUSSCESS_CODE";
};
// 검색 타입 저장
export const set_search_type = (sc_type) => {
	localStorage.setItem("search_type", sc_type);
};
// 검색어 가져오기
export const get_search_keyword = () => {
	return localStorage.getItem("search_keyword") || "";
};
// 검색어 저장
export const set_search_keyword = (sc_keyword) => {
	localStorage.setItem("search_keyword", sc_keyword);
};
// 검색어 삭제
export const remove_search_keyword = () => {
	localStorage.removeItem("search_keyword");
};
// 에코 기록(채팅 접속기록) 가져오기
export const get_echo_record = (echo_id) => {
	const echo_record = JSON.parse(localStorage.getItem("echo_record")) || {};
	return echo_record[echo_id] || null;
};
// 에코 기록(채팅 접속기록) 5개 까지 저장하기
export const set_echo_record = (echo_id, valObj) => {
	let obj = get_echo_record(echo_id) || {};
	// console.log(obj);
	obj = {
		...obj,
		...valObj,
		updated: new Date(),
	};
	const origin = JSON.parse(localStorage.getItem("echo_record")) || {};
	origin[echo_id] = obj;
	if (Object.keys(origin).length > 3) {
		let oldest_id = "";
		let oldest_date = new Date();
		Object.entries(origin).map((v) => {
			if (oldest_date > new Date(v[1].updated) && echo_id != v[0]) {
				oldest_date = new Date(v[1].updated);
				oldest_id = v[0];
			}
		});
		if (oldest_id) delete origin[oldest_id];
	}
	localStorage.setItem("echo_record", JSON.stringify(origin));
};
//
export const set_echo_record_last_scroll = (echo_id, echostep, chat_last_scroll) => {
	let obj = get_echo_record(echo_id) || null;
	if (obj) {
		testlog(`set_echo_record_last_scroll ${echo_id} ${echostep} ${chat_last_scroll}`);
		obj[echostep].chat_last_scroll = chat_last_scroll;
		const origin = JSON.parse(localStorage.getItem("echo_record")) || {};
		origin[echo_id] = obj;
		localStorage.setItem("echo_record", JSON.stringify(origin));
	}
};
