import { addService_doc } from "./services/addService";
import { authService_doc } from "./services/authService";
import { chatService_doc } from "./services/chatService";
import { mainService_doc } from "./services/mainService";
import testService_doc from "./services/testService";

// API 디렉토리의 중앙 집중 관리 파일
export const testService = { ...testService_doc };
export const authService = { ...authService_doc };
export const mainService = { ...mainService_doc };
export const addService = { ...addService_doc };
export const chatService = { ...chatService_doc };
