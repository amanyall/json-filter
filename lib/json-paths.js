const ARRAY_TOKEN = "[]";

export function flattenJSON(value) {
  const paths = new Set();

  function visit(node, path) {
    if (Array.isArray(node)) {
      if (path) {
        paths.add(`${path}${ARRAY_TOKEN}`);
      }

      const childPath = path ? `${path}${ARRAY_TOKEN}` : ARRAY_TOKEN;
      node.forEach((item) => visit(item, childPath));
      return;
    }

    if (isPlainObject(node)) {
      const entries = Object.entries(node);
      if (entries.length === 0 && path) {
        paths.add(path);
      }

      entries.forEach(([key, child]) => {
        const childPath = path ? `${path}.${key}` : key;
        if (isContainer(child)) {
          visit(child, childPath);
        } else {
          paths.add(childPath);
        }
      });
      return;
    }

    if (path) {
      paths.add(path);
    }
  }

  visit(value, "");
  return Array.from(paths).sort((a, b) => a.localeCompare(b));
}

export function filterJSONByPaths(original, selectedPaths) {
  if (selectedPaths.length === 0) {
    return {};
  }

  const selected = new Set(selectedPaths);

  function pick(node, path) {
    if (Array.isArray(node)) {
      const arrayPath = `${path}${ARRAY_TOKEN}`;
      const includeArrayValue = selected.has(arrayPath);
      const childSelections = hasSelectedDescendant(selected, `${arrayPath}.`);

      if (!childSelections) {
        return includeArrayValue ? node : undefined;
      }

      return node.map((item) => pick(item, arrayPath)).filter((item) => item !== undefined);
    }

    if (isPlainObject(node)) {
      if (path && selected.has(path) && !hasSelectedDescendant(selected, `${path}.`)) {
        return node;
      }

      const output = {};
      Object.entries(node).forEach(([key, child]) => {
        const childPath = path ? `${path}.${key}` : key;
        const directHit = selected.has(childPath) || selected.has(`${childPath}${ARRAY_TOKEN}`);
        const descendantHit =
          hasSelectedDescendant(selected, `${childPath}.`) ||
          hasSelectedDescendant(selected, `${childPath}${ARRAY_TOKEN}.`);

        if (!directHit && !descendantHit) {
          return;
        }

        const picked = pick(child, childPath);
        if (picked !== undefined) {
          output[key] = picked;
        }
      });
      return Object.keys(output).length > 0 ? output : undefined;
    }

    return selected.has(path) ? node : undefined;
  }

  return pick(original, "") ?? {};
}

function hasSelectedDescendant(selected, prefix) {
  for (const path of selected) {
    if (path.startsWith(prefix)) {
      return true;
    }
  }
  return false;
}

function isContainer(value) {
  return Array.isArray(value) || isPlainObject(value);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
