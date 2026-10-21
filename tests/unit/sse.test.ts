import { describe, expect, it } from "vitest";
import { formatHeartbeat, formatSse, SSE_HEADERS } from "@/lib/sse";
import { parseSseEvents } from "@/lib/sse-client";

describe("server SSE formatter", () => {
  it("formats named events with JSON data", () => {
    expect(formatSse("step", { step: "resolve_seeds", status: "running" })).toBe(
      'event: step\ndata: {"step":"resolve_seeds","status":"running"}\n\n',
    );
  });

  it("keeps JSON newlines escaped inside one data line", () => {
    expect(formatSse("card", { text: "line one\nline two" })).toBe(
      'event: card\ndata: {"text":"line one\\nline two"}\n\n',
    );
  });

  it("formats a comment heartbeat", () => {
    expect(formatHeartbeat()).toBe(": ping\n\n");
  });

  it("sets streaming headers that defeat buffering", () => {
    expect(SSE_HEADERS["Content-Type"]).toContain("text/event-stream");
    expect(SSE_HEADERS["Cache-Control"]).toContain("no-cache");
    expect(SSE_HEADERS["X-Accel-Buffering"]).toBe("no");
  });
});

describe("client SSE parser", () => {
  it("parses complete events and preserves an incomplete tail", () => {
    const result = parseSseEvents(
      'event: step\ndata: {"a":1}\n\nevent: card\ndata: {"b":2}\n\npartial',
    );

    expect(result.events).toEqual([
      { event: "step", data: '{"a":1}' },
      { event: "card", data: '{"b":2}' },
    ]);
    expect(result.rest).toBe("partial");
  });

  it("joins multi-line data fields with a newline", () => {
    const result = parseSseEvents("event: note\ndata: line one\ndata: line two\n\n");
    expect(result.events).toEqual([{ event: "note", data: "line one\nline two" }]);
  });

  it("ignores comments and blank padding", () => {
    const result = parseSseEvents(": ping\n\nevent: step\ndata: {}\n\n");
    expect(result.events).toEqual([{ event: "step", data: "{}" }]);
  });

  it("handles CRLF line endings", () => {
    const result = parseSseEvents('event: step\r\ndata: {"a":1}\r\n\r\n');
    expect(result.events).toEqual([{ event: "step", data: '{"a":1}' }]);
  });

  it("defaults to the message event name", () => {
    const result = parseSseEvents("data: hello\n\n");
    expect(result.events).toEqual([{ event: "message", data: "hello" }]);
  });

  it("does not emit events that have no data field", () => {
    const result = parseSseEvents("event: step\n\n");
    expect(result.events).toEqual([]);
  });

  it("returns an empty result for an empty buffer", () => {
    expect(parseSseEvents("")).toEqual({ events: [], rest: "" });
  });

  it("reassembles an event split across chunks", () => {
    const first = parseSseEvents('event: card\ndata: {"name":"A');
    expect(first.events).toEqual([]);
    expect(first.rest).toBe('event: card\ndata: {"name":"A');

    const second = parseSseEvents(`${first.rest}lma"}\n\n`);
    expect(second.events).toEqual([{ event: "card", data: '{"name":"Alma"}' }]);
    expect(second.rest).toBe("");
  });
});
