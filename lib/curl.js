export function parseCurlCommand(command) {
  const tokens = tokenize(command.replace(/\\\r?\n/g, " "));

  if (tokens.length === 0 || tokens[0] !== "curl") {
    throw new Error("Paste a cURL command that starts with curl.");
  }

  const headers = {};
  let method = "GET";
  let body;
  let url = "";

  for (let index = 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    const next = tokens[index + 1];

    if (token === "-X" || token === "--request") {
      method = requireValue(next, token).toUpperCase();
      index += 1;
      continue;
    }

    if (token === "-H" || token === "--header") {
      const header = requireValue(next, token);
      const separator = header.indexOf(":");
      if (separator > -1) {
        const key = header.slice(0, separator).trim();
        const value = header.slice(separator + 1).trim();
        headers[key] = value;
      }
      index += 1;
      continue;
    }

    if (["-d", "--data", "--data-raw", "--data-binary", "--data-ascii"].includes(token)) {
      body = requireValue(next, token);
      if (method === "GET") {
        method = "POST";
      }
      index += 1;
      continue;
    }

    if (token === "-A" || token === "--user-agent") {
      headers["User-Agent"] = requireValue(next, token);
      index += 1;
      continue;
    }

    if (token === "-u" || token === "--user") {
      const credentials = Buffer.from(requireValue(next, token)).toString("base64");
      headers.Authorization = `Basic ${credentials}`;
      index += 1;
      continue;
    }

    if (token.startsWith("http://") || token.startsWith("https://")) {
      url = token;
    }
  }

  if (!url) {
    throw new Error("Could not find an http or https URL in the cURL command.");
  }

  return { url, method, headers, body };
}

function requireValue(value, flag) {
  if (!value) {
    throw new Error(`Missing value after ${flag}.`);
  }
  return value;
}

function tokenize(input) {
  const tokens = [];
  let current = "";
  let quote = null;
  let escaping = false;

  for (const char of input.trim()) {
    if (escaping) {
      current += char;
      escaping = false;
      continue;
    }

    if (char === "\\" && quote !== "'") {
      escaping = true;
      continue;
    }

    if ((char === "'" || char === '"') && !quote) {
      quote = char;
      continue;
    }

    if (char === quote) {
      quote = null;
      continue;
    }

    if (/\s/.test(char) && !quote) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (quote) {
    throw new Error("The cURL command has an unterminated quote.");
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}
