export function highlightJSON(json) {
  const tokenPattern =
    /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(?=\s*:)|"(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;

  return json.split(tokenPattern).map((token, index) => {
    if (!token) {
      return null;
    }

    let className = "text-stone-200";
    if (/^".*"(?=\s*$)/.test(token) && json.includes(`${token}:`)) {
      className = "text-emerald-300";
    } else if (/^"/.test(token)) {
      className = "text-amber-200";
    } else if (/true|false/.test(token)) {
      className = "text-sky-300";
    } else if (/null/.test(token)) {
      className = "text-stone-500";
    } else if (/^-?\d/.test(token)) {
      className = "text-fuchsia-200";
    }

    return (
      <span className={className} key={`${token}-${index}`}>
        {token}
      </span>
    );
  });
}
