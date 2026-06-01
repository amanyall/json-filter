import { NextResponse } from "next/server";
import { parseCurlCommand } from "@/lib/curl";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { curl } = await request.json();

    if (!curl) {
      return NextResponse.json({ error: "Missing cURL command." }, { status: 400 });
    }

    const parsed = parseCurlCommand(curl);
    const response = await fetch(parsed.url, {
      method: parsed.method,
      headers: parsed.headers,
      body: parsed.body,
      redirect: "follow"
    });

    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();
    const payload = parseResponseBody(text, contentType);

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      payload
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to execute cURL command." },
      { status: 400 }
    );
  }
}

function parseResponseBody(text, contentType) {
  if (contentType.includes("application/json") || looksLikeJSON(text)) {
    return JSON.parse(text);
  }
  return text;
}

function looksLikeJSON(value) {
  const trimmed = value.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}
