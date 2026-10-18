export function usernameError(value: string): string {
  if (value.length < 3) {
    return "文字数が足りません";
  }

  if (value.length > 25) {
    return "文字数が超過しています";
  }

  if (/[A-Z]/.test(value)) {
    return "すべて小文字にしてください";
  }

  if (/[^a-z0-9]/.test(value)) {
    return "ユーザーネームに使用できない記号が含まれています";
  }

  return "";
}
