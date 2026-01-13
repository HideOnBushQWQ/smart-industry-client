export type LocalUser = {
  username: string;
  password: string;
  roles: string[]; // 示例：["admin"] / ["user"]
  buttons?: string[]; // 可选：权限点
};

function parseJSON<T>(raw: any, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const LOCAL_USERS: LocalUser[] = parseJSON<LocalUser[]>(import.meta.env.VITE_LOCAL_USERS, [
  { username: 'admin', password: '123456', roles: ['admin'] }
]);

export const FAKE_TOKEN_TTL_MIN = Number(import.meta.env.VITE_FAKE_TOKEN_TTL || 1440);
