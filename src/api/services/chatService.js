import { get_normal, post_formData, post_urlFormData, put_urlFormData } from "../apiFilter";
import API_URL from "../endpoints";

export const chatService_doc = {
	get_chatList: async (obj) => await get_normal(API_URL.CHAT, obj),
	set_chat: async (obj) => await post_urlFormData(API_URL.CHAT, obj),
	set_chatFile: async (obj) => await post_formData(API_URL.CHAT_FILE, obj),
	chat_react: async (obj) => await put_urlFormData(API_URL.CHAT, obj),
};
