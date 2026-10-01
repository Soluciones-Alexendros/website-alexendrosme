"use client";

import { Mail } from "lucide-react";
import { buildMailto } from "@/lib/contact";
import { useI18n } from "@/lib/i18n";

export function ContactFab() {
  const { t } = useI18n();

  return (
    <a href={buildMailto()} className="fab-btn" aria-label={t("contact.emailLabel")}>
      <Mail className="icn-sm" aria-hidden="true" />
      <span>{t("hero.ctaContact")}</span>
    </a>
  );
}
