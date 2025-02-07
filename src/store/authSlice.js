import { writable } from "svelte/store";
import { cookies } from "../cookies";
import { loc, push } from "svelte-spa-router";
import { authService, testService } from "../api";
import { modal_alert } from "./modalSlice";
import { get_loginType, set_loginType } from "../lib/local_store";

const create_login = () => {
	const { subscribe, set } = writable(false);
	let reToken_ing = false;
	let getUser_ing = false;

	const login = (aToken, rToken) => {
		reToken(aToken, rToken);
		set(true);
	};

	const logout = (type, no_alert) => {
		cookies.remove("access_token");
		cookies.remove("refresh_token");
		set(false);
		if (!no_alert) modal_alert.open("로그아웃 되었습니다.");
		userInfo.set({
			member_no: "",
			name: "",
			type: "",
			position: "",
		});
		if (type) push("/login/" + type);
		else push("/login");
		localStorage.removeItem("type");
		localStorage.removeItem("search_type");
		localStorage.removeItem("echo_record");
		localStorage.removeItem("search_keyword");
	};

	const reToken = (aToken, rToken) => {
		cookies.set("access_token", aToken, 60 * 30);
		cookies.set("refresh_token", rToken, 60 * 60 * 24 * 3);
	};

	const tokenCheck = async () => {
		let aToken = cookies.get("access_token");
		const rToken = cookies.get("refresh_token");
		if (!rToken) {
			let member_type = "";
			const store_url = loc.subscribe((v) => {
				member_type = new URLSearchParams(v.querystring).get("member_type"); // 채팅방 고유값
				last_connect_url.set(v.location + "?" + v.querystring);
			});
			store_url();
			if (member_type) logout(member_type);
			else logout();
		} else if (!aToken && rToken) {
			if (!reToken_ing) {
				reToken_ing = true;
				await authService
					.reToken({ refresh_token: rToken })
					.then((data) => {
						// console.log(data);
						reToken(data.access_token, data.refresh_token);
						aToken = data.access_token;
					})
					.catch((err) => {
						modal_alert.open("서버 오류<br />IT전략실 문의바람.");
						logout(get_loginType(), true);
					});
				reToken_ing = false;
			}
		}

		const unsubscribe = userInfo.subscribe(async (uInfo) => {
			if (!uInfo.name && aToken && !getUser_ing) {
				getUser_ing = true;
				await authService.getUserInfo().then((data) => {
					// console.log(data);
					const login_type = get_loginType();
					userInfo.set({ ...data.user });
					set_loginType(data.user.type);
					if (login_type && login_type != data.user.type) {
						location.reload();
					}
				});
				getUser_ing = false;
			}
		});
		unsubscribe();
		return;
	};

	return { subscribe, set, login, logout, tokenCheck };
};

export const loginOn = create_login();
export const userInfo = writable({
	member_no: "",
	name: "",
	type: "", // valley, ridge, tree
	position: "",
});
export const last_connect_url = writable("");
