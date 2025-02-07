import { get_normal, put_urlFormData } from "../apiFilter";
import API_URL from "../endpoints";

export const mainService_doc = {
	get_echoList: async (obj) => await get_normal(API_URL.ECHO_LIST, obj),
	set_echoFix: async (obj) => await put_urlFormData(API_URL.ECHO_LIST, obj),
};
