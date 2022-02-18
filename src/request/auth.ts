const TokenKey = "Authorization$://"; //授权码

/*
 * 播放MP3
 * */
export function audioPlay(mp3: string) {
  let audioPlay = new Audio();
  audioPlay.src = mp3;
  audioPlay.play();
}

/*
 * 获取getItem
 * */
export function getLocal(Key?: string | undefined) {
  return localStorage.getItem(Key ? Key : TokenKey) as any;
}

/*
 * 设置setItem
 * */
export function setLocal(params: any, Key?: string) {
  return localStorage.setItem(Key ? Key : TokenKey, params);
}

/*
 * 移除removeItem
 * */
export function removeLocal(Key?: string) {
  return localStorage.removeItem(Key ? Key : TokenKey);
}

/*
 * getBaseFile64
 * */
export async function getBaseFile64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/*
 *通过id 显示id所在位置
 * */
export function naver(id: string) {
  var obj = document.getElementById(id);
  var oPos = obj?.offsetTop;
  document.documentElement.scrollTop = oPos || 0;
}
