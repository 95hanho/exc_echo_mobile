import { get_download, get_normal } from "../apiFilter";
import API_URL from "../endpoints";

export const addService_doc = {
	get_group: async (obj) => await get_normal(API_URL.GROUP, obj),
	get_needs: async (obj) => await get_normal(API_URL.NEEDS, obj),
	get_outline: async (obj) => await get_normal(API_URL.ECHO_OUTLINE, obj),
	get_fileList: async (obj) => await get_normal(API_URL.FILE, obj),
	file_download: async (obj) => await get_download(API_URL.FILE_DOWNLOAD, obj),
	get_document: async (obj) => await get_normal(API_URL.DOCUMENT, obj),
};
