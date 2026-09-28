type LatestValueMessage<T> =
  | { type: "update"; value: T }
  | { type: "request" }
  | { type: "latest"; value: T };

/** Time to wait for the control tab's reply when opening a window. */
const REQUEST_TIMEOUT_MS = 1000;

/**
 * BroadcastChannel that remembers the last value sent by this tab and delivers it to
 * windows opened after it (the web equivalent of the Electron main process
 * cache). Subscribers only receive updates, not the replies to requests.
 */
export class LatestValueChannel<T> {
  private readonly channel: BroadcastChannel | null;
  private latest: T | null = null;

  constructor(name: string) {
    this.channel = typeof window !== "undefined" ? new BroadcastChannel(name) : null;
    this.channel?.addEventListener("message", (event: MessageEvent<LatestValueMessage<T>>) => {
      if (event.data.type === "request" && this.latest !== null) {
        this.channel?.postMessage({ type: "latest", value: this.latest });
      }
    });
  }

  post(value: T | null) {
    this.latest = value;
    this.channel?.postMessage({ type: "update", value });
  }

  /** Last value sent by another tab, or `null` if none replies in time. */
  requestLatest(): Promise<T | null> {
    const channel = this.channel;
    if (!channel) return Promise.resolve(null);

    return new Promise((resolve) => {
      const handler = (event: MessageEvent<LatestValueMessage<T>>) => {
        if (event.data.type === "latest") finish(event.data.value);
      };
      const finish = (value: T | null) => {
        clearTimeout(timer);
        channel.removeEventListener("message", handler);
        resolve(value);
      };
      const timer = setTimeout(() => finish(null), REQUEST_TIMEOUT_MS);
      channel.addEventListener("message", handler);
      channel.postMessage({ type: "request" });
    });
  }

  subscribe(listener: (value: T) => void) {
    const channel = this.channel;
    if (!channel) return () => {};
    const handler = (event: MessageEvent<LatestValueMessage<T>>) => {
      if (event.data.type === "update") listener(event.data.value);
    };
    channel.addEventListener("message", handler);
    return () => channel.removeEventListener("message", handler);
  }
}
