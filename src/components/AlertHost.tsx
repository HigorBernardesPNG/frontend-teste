import React from "react";
import { useAlert } from "../context/AlertContext";

const kindToClass: Record<string, string> = {
  success: "alert-success",
  danger: "alert-danger",
  warning: "alert-warning",
  info: "alert-info",
};

export const AlertHost: React.FC = () => {
  const { alerts, close } = useAlert();

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1080, maxWidth: 420, width: "100%" }} // offcanvas/modal-backdrop padrão
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex flex-column gap-2">
        {alerts.map((a) => (
          <div
            key={a.id}
            role="alert"
            className={`alert ${kindToClass[a.kind]} alert-dismissible fade show shadow-sm mb-0`}
          >
            {a.title && <h6 className="alert-heading mb-1">{a.title}</h6>}
            <div>{a.message}</div>

            {/* Botão padrão do Bootstrap para fechar*/}
            <button
              type="button"
              className="btn-close"
              aria-label="Fechar alerta"
              onClick={() => close(a.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
