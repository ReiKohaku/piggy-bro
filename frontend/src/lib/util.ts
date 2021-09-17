export function humanDateLength(second: number) {
  const sec = second % 60;
  const min = Math.floor(second / 60) % 60;
  const hour = Math.floor(second / 60 / 60) % 24;
  const day = Math.floor(second / 60 / 60 / 24);
  return `${day}天${hour}时${min}分${sec}秒`
}
