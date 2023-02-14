export type UserData = {
  login: string;
  avatarUrl: string;
};

export type Settings = {
  user: UserData;
  repo: string;
  blacklist: string[];
};

export function setSettings(settings: Settings): void {
  try {
    localStorage.setItem('settings', JSON.stringify(settings));
  } catch {
    console.error('localStorage error');
  }
}

export function getSettings(): Settings | null {
  let settings: Settings;
  try {
    let str = localStorage.getItem('settings');
    if (str !== null) return JSON.parse(str);
  } catch {
    console.error('localStorage error');
  }
  return null;
}

export function getRandom(num: number) {
  return Math.floor(Math.random() * num);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
