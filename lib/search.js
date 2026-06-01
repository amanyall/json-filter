import Fuse from "fuse.js";

export function createMatchedPathSet(paths, search) {
  const query = search.trim();
  if (!query) {
    return new Set();
  }

  const fuse = new Fuse(
    paths.map((path) => ({
      path,
      label: path.replace(/\[\]/g, " array ").replace(/[._]/g, " ")
    })),
    {
      keys: ["path", "label"],
      threshold: 0.36,
      ignoreLocation: true
    }
  );

  return new Set(fuse.search(query).slice(0, 50).map((result) => result.item.path));
}
