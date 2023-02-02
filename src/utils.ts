export const j = (...classNames: (string | undefined)[]) => {
  return classNames.filter(Boolean).join(" ");
};

export const copyToClipboard = async (text: string) => {
  try {
    // `writeText()` returns promise that resolves if successfully copied to
    // clipboard otherwise rejects if we don't have permissions
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const shareLink = (opts: Omit<ShareData, "files">) => {
  // TODO: handle exceptions (@see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#exceptions)
  if (typeof navigator.share === "function") {
    navigator.share(opts);
  } else {
    // Unfortunately Firefox doesn't support `share()` api
    if (opts.url) {
      copyToClipboard(opts.url);
    }
  }
};
