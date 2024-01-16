export function getHighlightedText(text: string, highlight: string) {
  if (!highlight) return text;

  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts
        .filter((i) => !!i)
        .map((part, index) => {
          if (part.toLowerCase() === highlight.toLowerCase()) {
            return (
              <span key={index} className="bg-primary">
                {part}
              </span>
            );
          }
          return part;
        })}
    </>
  );
}
