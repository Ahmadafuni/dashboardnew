import { atom } from "recoil";

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  userRole: string;
  userImage?: string;
}

export const userInfo = atom<UserInfo | null>({
  key: "userInfo",
  default: null,
});
