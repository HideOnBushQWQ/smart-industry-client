import { FAKE_TOKEN_TTL_MIN, LOCAL_USERS } from '@/constants/local-users';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LocalAuthApi {
  export type LoginToken = { token: string; refreshToken: string };
  export type UserInfo = {
    userId: string;
    userName: string;
    roles: string[];
    buttons: string[];
  };
}

export async function fetchLogin(userName: string, password: string) {
  // 模拟网络延迟
  await new Promise(r => {
    setTimeout(r, 200);
  });
  const u = LOCAL_USERS.find(x => x.username === userName && x.password === password);
  if (!u) return { data: null as any, error: new Error('用户名或密码不正确') };

  const token = `fake.${btoa(`${u.username}.${Date.now()}`)}.${Math.random().toString(36).slice(2)}`;
  const refreshToken = `r.${Math.random().toString(36).slice(2)}`;
  return { data: { token, refreshToken } as LocalAuthApi.LoginToken, error: null };
}

export async function fetchGetUserInfo() {
  // 模拟网络延迟
  await new Promise(r => {
    setTimeout(r, 120);
  });
  // 直接用第一个用户当“当前用户”，也可以从 localStorage 读 token 后解析用户名来取
  const first = LOCAL_USERS[0];
  const info: LocalAuthApi.UserInfo = {
    userId: first.username,
    userName: first.username,
    roles: first.roles,
    buttons: first.buttons ?? []
  };
  return { data: info, error: null as any };
}

/** 可选：提供一个本地刷新逻辑 */
export async function fetchRefreshToken() {
  await new Promise(r => {
    setTimeout(r, 120);
  });
  const token = `fake.${btoa(`${Date.now()}`)}.${Math.random().toString(36).slice(2)}`;
  const refreshToken = `r.${Math.random().toString(36).slice(2)}`;
  return { data: { token, refreshToken }, error: null as any };
}

export const FAKE_TTL_MIN = FAKE_TOKEN_TTL_MIN;
