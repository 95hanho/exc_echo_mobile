import { writable } from "svelte/store";

const create_modal_alert = () => {
	const { set, subscribe } = writable(false);
	const open = (txt) => {
		set(true);
		modal_alert_txt.set(txt);
	};
	const close = () => set(false);
	return { open, close, subscribe };
};
const create_modal_confirm = () => {
	const { set, subscribe } = writable(false);
	let setTxt = "";

	const open = (txt, inSetTxt) => {
		set(true);
		modal_confirm_txt.set(txt);
		setTxt = inSetTxt;
		modal_confirm_result.set("");
	};
	const close = () => set(false);
	const check = () => {
		modal_confirm_result.set(setTxt);
		close();
	};

	return {
		subscribe,
		open,
		close,
		check,
	};
}
const create_modal_chatReact = () => {
	const { set, subscribe } = writable(false);
	const open = () => {
		set(true);
	};
	const react = (type) => {
		modal_chatReact_type.set(type);
		set(false);
	};
	const close = () => {
		set(false);
	}
	return { open, close, react, subscribe };
};
const create_modal_chatAdd = () => {
	const { set, subscribe } = writable(false);
	const open = () => {
		set(true);
	};
	const react = (type) => {
		modal_chatAdd_type.set(type);
		set(false);
	};
	const close = () => set(false);
	return { open, close, react, subscribe };
};
const create_modal_dialog = () => {
	const { set, subscribe } = writable(false);
	const open = () => {
		set(true);
	};
	const close = () => set(false);
	return { open, close, subscribe };
};
// 알람 모달
export const modal_alert = create_modal_alert();
export const modal_alert_txt = writable("");
// 알람 확인 모달
export const modal_confirm = create_modal_confirm();
export const modal_confirm_txt = writable("");
export const modal_confirm_result = writable("");
// 채팅 반응
export const modal_chatReact = create_modal_chatReact();
export const modal_chatReact_type = writable(0);
// 채팅 추가
export const modal_chatAdd = create_modal_chatAdd();
export const modal_chatAdd_type = writable(0);
// 계정설정
export const modal_dialog = create_modal_dialog();
export const modal_dialog_list = writable(null);