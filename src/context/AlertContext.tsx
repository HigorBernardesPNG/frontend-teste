import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
export type AlertKind = "success" | "danger" | "warning" | "info";

export type AlertMessage = {
  id: string;
  kind: AlertKind;
  message: React.ReactNode;
  title?: string;
  autoDismiss?: number; 
};

type AlertContextValue = {
  alerts: AlertMessage[];
  notify: (msg: Omit<AlertMessage, "id">) => string; // retorna id
  close: (id: string) => void;
  clear: () => void;

  success: (message: React.ReactNode, opts?: Omit<AlertMessage, "id" | "kind" | "message">) => string;
  danger: (message: React.ReactNode, opts?: Omit<AlertMessage, "id" | "kind" | "message">) => string;
  warning: (message: React.ReactNode, opts?: Omit<AlertMessage, "id" | "kind" | "message">) => string;
  info: (message: React.ReactNode, opts?: Omit<AlertMessage, "id" | "kind" | "message">) => string;
};

const AlertContext = createContext<AlertContextValue | null>(null);

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const AlertProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  // Guardamos timeouts por id para conseguir limpar em unmount/close manual
  const timersRef = useRef<Map<string, number>>(new Map());

  const close = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id != id));
    const timerId = timersRef.current.get(id);
    if (timerId) {
      clearTimeout(timerId);
      timersRef.current.delete(id);
    }
  }, []);

  const scheduleAutoDismiss = useCallback((msg: AlertMessage) => {
    if (msg.autoDismiss && msg.autoDismiss > 0) {
      const t = window.setTimeout(() => close(msg.id), msg.autoDismiss);
      timersRef.current.set(msg.id, t);
    }
  }, [close]);

  const notify = useCallback((data: Omit<AlertMessage, "id">) => {
    const msg: AlertMessage = { id: uid(), ...data };
    setAlerts(prev => [msg, ...prev]);
    scheduleAutoDismiss(msg);
    return msg.id;
  }, [scheduleAutoDismiss]);

  const clear = useCallback(() => {
    // fecha todos e limpa timers
    setAlerts([]);
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
  }, []);

  const success = useCallback((message: React.ReactNode, opts?: Omit<AlertMessage, "id" | "kind" | "message">) =>
    notify({ kind: "success", message, ...opts }), [notify]);

  const danger = useCallback((message: React.ReactNode, opts?: Omit<AlertMessage, "id" | "kind" | "message">) =>
    notify({ kind: "danger", message, ...opts }), [notify]);

  const warning = useCallback((message: React.ReactNode, opts?: Omit<AlertMessage, "id" | "kind" | "message">) =>
    notify({ kind: "warning", message, ...opts }), [notify]);

  const info = useCallback((message: React.ReactNode, opts?: Omit<AlertMessage, "id" | "kind" | "message">) =>
    notify({ kind: "info", message, ...opts }), [notify]);

  // Evita recriação desnecessária
  const value = useMemo<AlertContextValue>(() => ({
    alerts, notify, close, clear, success, danger, warning, info
  }), [alerts, notify, close, clear, success, danger, warning, info]);

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

export function useAlert() {
  const ctx = React.useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlert precisa estar dentro de <AlertProvider>.");
  }
  return ctx;
}
