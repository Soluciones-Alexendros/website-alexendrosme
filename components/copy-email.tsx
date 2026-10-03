"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Status = "idle" | "copied" | "error";
const RESET_MS = 2400;

/** Copia el correo al portapapeles con confirmación visible Y anunciada (aria-live). */
export function CopyEmail() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    let next: Status = "copied";
    try {
      await navigator.clipboard.writeText(siteConfig.contact.email);
    } catch {
      next = "error";
    }
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), RESET_MS);
  };

  const label =
    status === "copied"
      ? t("contact.copied")
      : status === "error"
        ? t("contact.copyError")
        : t("contact.copy");

  return (
    <>
      <button
        type="button"
        className={cn("fab-btn fab-btn--ghost")}
        data-state={status}
        onClick={copy}
      >
        {status === "copied" ? (
          <Check className="icn-sm" aria-hidden="true" />
        ) : (
          <Copy className="icn-sm" aria-hidden="true" />
        )}
        <span>{label}</span>
      </button>
      {/* Región viva visible solo para lectores de pantalla: anuncia el resultado. */}
      <span className="sr-only" role="status" aria-live="polite">
        {status === "idle" ? "" : label}
      </span>
    </>
  );
}
