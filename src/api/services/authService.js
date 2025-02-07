import { get_normal, post_urlFormData } from "../apiFilter";
import API_URL from "../endpoints";

export const authService_doc = {
	login: async (obj) => await post_urlFormData(API_URL.USER, obj),
	reToken: async (obj) => await post_urlFormData(API_URL.TOKEN, obj),
	getUserInfo: async () => await get_normal(API_URL.USER),
	echo_search: async (obj) => await post_urlFormData(API_URL.ECHO_SEARCH, obj),
};
