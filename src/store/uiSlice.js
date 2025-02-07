import { writable } from "svelte/store";

// 메인 스크롤 되돌리기
export const main_last_scroll = writable(0);
// 모바일 채팅입력창 오픈
export const textinput_open = writable(false);