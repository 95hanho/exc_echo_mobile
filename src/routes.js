import wrap from "svelte-spa-router/wrap";
import Main from "./routes/main.svelte";
import Test from "./routes/Test.svelte";
import { last_connect_url, loginOn } from "./store/authSlice";
import { loc, location, push, querystring, replace } from "svelte-spa-router";
import { modal_alert } from "./store/modalSlice";
import Login from "./routes/login.svelte";
import Chat from "./routes/chat.svelte";
import Needs from "./routes/needs.svelte";
import Outline from "./routes/outline.svelte";
import AttachFile from "./routes/attach-file.svelte";
import NotPage from "./routes/not-page.svelte";
import Members from "./routes/members.svelte";
import { cookies } from "./cookies";
import { get_loginType } from "./lib/local_store";

// 로그인 페이지에 토큰체크 & 헤더네임가져오기
const loginUrlCheck = async (component) => {
	let result = true;
	let member_type = "";
	const check = loginOn.subscribe(async (on) => {
		if (!on) {
			const store_url = loc.subscribe((v) => {
				member_type = new URLSearchParams(v.querystring).get("member_type"); // 채팅방 고유값
				last_connect_url.set(v.location + "?" + v.querystring);
			});
			store_url();
			modal_alert.open("로그인이 필요한 페이지입니다.");
			cookies.remove("access_token");
			result = false;
		}
	});
	check();
	if (!result) {
		if (member_type) replace("/login/" + member_type);
		else replace("/login");
		return null;
	}
	return component;
};

const routes = {
	"/": wrap({
		asyncComponent() {
			return loginUrlCheck(Main);
		},
	}),
	"/login": wrap({
		asyncComponent() {
			let t = get_loginType();
			replace(`/login/${t}`);
			return null;
		},
	}),
	"/login/:type": wrap({
		component: Login,
	}),
	"/chat": wrap({
		async asyncComponent() {
			replace("/chat/0");
			return null;
		},
	}),
	"/chat/:echo_id": wrap({
		asyncComponent() {
			return loginUrlCheck(Chat);
		},
	}),
	"/chat/:echo_id/members": wrap({
		asyncComponent() {
			return loginUrlCheck(Members);
		},
	}),
	"/chat/:echo_id/needs": wrap({
		asyncComponent() {
			return loginUrlCheck(Needs);
		},
	}),
	"/chat/:echo_id/outline": wrap({
		asyncComponent() {
			return loginUrlCheck(Outline);
		},
	}),
	"/chat/:echo_id/attach-file": wrap({
		asyncComponent() {
			return loginUrlCheck(AttachFile);
		},
	}),
	"/notPage": wrap({
		component: NotPage,
	}),
	"/*": wrap({
		asyncComponent() {
			replace("/notPage");
			return null;
		},
	}),
	/*  */
	// "/test": wrap({
	// 	async asyncComponent() {
	// 		return loginUrlCheck(Test);
	// 	},
	// }),
};

export default routes;
