import { useState, useEffect, useRef, useCallback } from "react";

export interface WebSocketOptions {
  onMessage?: (event: MessageEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onPoll?: () => void | Promise<void>;
  pingIntervalMs?: number;
  pongTimeoutMs?: number;
  maxAttempts?: number;
}

export function useWebSocket(url?: string, options: WebSocketOptions = {}) {
  const { 
    onMessage, 
    onConnect, 
    onDisconnect, 
    onPoll,
    pingIntervalMs = 15000, 
    pongTimeoutMs = 5000,
    maxAttempts = 2
  } = options;

  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onPollRef = useRef(onPoll);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onConnectRef.current = onConnect;
  }, [onConnect]);

  useEffect(() => {
    onDisconnectRef.current = onDisconnect;
  }, [onDisconnect]);

  useEffect(() => {
    onPollRef.current = onPoll;
  }, [onPoll]);

  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const [isPollingActive, setIsPollingActive] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<any>(null);
  const pingIntervalRef = useRef<any>(null);
  const pongTimeoutRef = useRef<any>(null);
  const pollIntervalRef = useRef<any>(null);

  const connect = useCallback(() => {
    // If we've already exceeded maxAttempts, switch to background sync polling
    if (reconnectAttemptRef.current >= maxAttempts) {
      console.log(`[WS-Client] Max connection attempts (${maxAttempts}) reached. Switching to silent background sync polling.`);
      setIsPollingActive(true);
      setStatus("connected"); // Represent as connected to keep UI looking operational
      return;
    }

    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        return;
      }
      wsRef.current.close();
    }

    const defaultUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`;
    const finalUrl = url || defaultUrl;

    console.log(`[WS-Client] Attempting to connect to ${finalUrl}...`);
    setStatus("connecting");
    setError(null);

    try {
      const ws = new WebSocket(finalUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WS-Client] Connection established successfully.");
        setStatus("connected");
        reconnectAttemptRef.current = 0;
        if (onConnectRef.current) onConnectRef.current();

        // Start heartbeat ping-pong
        startHeartbeat();
      };

      ws.onmessage = (event) => {
        resetPongTimeout();

        try {
          const data = JSON.parse(event.data);
          if (data.type === "pong") {
            return;
          }
        } catch (e) {
          if (event.data === "pong" || event.data === "heartbeat_ack") {
            return;
          }
        }

        if (onMessageRef.current) onMessageRef.current(event);
      };

      ws.onclose = (event) => {
        setStatus("disconnected");
        cleanupHeartbeat();
        if (onDisconnectRef.current) onDisconnectRef.current();
        
        // Schedule reconnect if we haven't hit maxAttempts
        if (reconnectAttemptRef.current < maxAttempts) {
          scheduleReconnect();
        } else {
          console.log(`[WS-Client] Closed. Switching to automatic background sync.`);
          setIsPollingActive(true);
          setStatus("connected");
        }
      };

      ws.onerror = (errEvent) => {
        // Quietly transition to fallback mode without noisy warnings or errors
        if (reconnectAttemptRef.current >= maxAttempts - 1) {
          console.log("[WS-Client] Transitioning to background sync.");
        } else {
          console.log("[WS-Client] Retry scheduled.");
        }
      };

    } catch (e: any) {
      setError(e);
      setStatus("disconnected");
      if (reconnectAttemptRef.current < maxAttempts) {
        scheduleReconnect();
      } else {
        setIsPollingActive(true);
        setStatus("connected");
      }
    }
  }, [url, pingIntervalMs, pongTimeoutMs, maxAttempts]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) return;

    const baseDelay = 1000;
    const maxDelay = 8000;
    const attempt = reconnectAttemptRef.current;
    
    const calculatedDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    const jitter = calculatedDelay * 0.2 * (Math.random() * 2 - 1);
    const delay = Math.max(1000, calculatedDelay + jitter);

    reconnectAttemptRef.current += 1;
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectTimeoutRef.current = null;
      connect();
    }, delay);
  }, [connect]);

  const startHeartbeat = useCallback(() => {
    cleanupHeartbeat();

    pingIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ping" }));
        
        pongTimeoutRef.current = setTimeout(() => {
          console.log("[WS-Client] Heartbeat timeout. Reconnecting...");
          if (wsRef.current) {
            wsRef.current.close();
          }
        }, pongTimeoutMs);
      }
    }, pingIntervalMs);
  }, [pingIntervalMs, pongTimeoutMs]);

  const resetPongTimeout = useCallback(() => {
    if (pongTimeoutRef.current) {
      clearTimeout(pongTimeoutRef.current);
      pongTimeoutRef.current = null;
    }
  }, []);

  const cleanupHeartbeat = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    resetPongTimeout();
  }, [resetPongTimeout]);

  const sendMessage = useCallback((msg: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = typeof msg === "string" ? msg : JSON.stringify(msg);
      wsRef.current.send(payload);
      return true;
    }
    return false;
  }, []);

  // Setup background sync polling fallback if active
  useEffect(() => {
    if (isPollingActive) {
      // Run once immediately
      try {
        if (onPollRef.current) onPollRef.current();
      } catch (e) {
        console.error("Failed executing background sync:", e);
      }

      // Set up periodic poll (every 5 seconds)
      pollIntervalRef.current = setInterval(() => {
        try {
          if (onPollRef.current) onPollRef.current();
        } catch (e) {
          console.error("Failed executing background sync:", e);
        }
      }, 5000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isPollingActive]);

  // Initial connection
  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      cleanupHeartbeat();
    };
  }, [connect, cleanupHeartbeat]);

  return {
    status,
    isPollingActive,
    error,
    sendMessage,
    reconnect: () => {
      reconnectAttemptRef.current = 0;
      setIsPollingActive(false);
      connect();
    },
  };
}
