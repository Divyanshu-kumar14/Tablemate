export interface ParsedSseEvent {
  event: string;
  data: string;
}

/**
 * Incremental SSE parser. Feed it the decoded buffer; it returns complete
 * events plus the incomplete tail to carry into the next chunk.
 */
export function parseSseEvents(buffer: string): { events: ParsedSseEvent[]; rest: string } {
  const parts = buffer.split(/\r?\n\r?\n/);
  const rest = parts.pop() ?? "";
  const events: ParsedSseEvent[] = [];

  for (const part of parts) {
    if (!part.trim()) continue;
    let event = "message";
    const data: string[] = [];

    for (const line of part.split(/\r?\n/)) {
      if (line.startsWith(":")) continue;
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        data.push(line.slice(5).replace(/^ /, ""));
      }
    }

    if (data.length > 0) events.push({ event, data: data.join("\n") });
  }

  return { events, rest };
}
