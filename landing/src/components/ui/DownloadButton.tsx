"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { SiteConfig } from "@/core/constants/SiteConfig";
import { useI18n } from "@/core/i18n/I18nProvider";
import { Icon } from "./Icon";

interface DownloadButtonProps {
  size?: "sm" | "lg";
  /** Direct link to the file (GitHub Releases); without it, leads to the download page. */
  fileUrl?: string;
  children?: ReactNode;
}

/** The beam (beam-border) rotates behind; the button's core covers it, leaving a 1px border. */
export function DownloadButton({ size = "lg", fileUrl, children }: DownloadButtonProps) {
  const { t, href } = useI18n();
  const outerClass =
    "beam-border group inline-flex rounded-full p-px transition-transform duration-200 hover:-translate-y-0.5";
  const inner = (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-ember font-semibold text-soot transition-colors group-hover:bg-[#ff7d33] ${
        size === "lg" ? "px-7 py-4 text-base" : "px-4 py-3 text-sm"
      }`}
    >
      <Icon name="download" size={size === "lg" ? 20 : 16} />
      {children ?? t("common.downloadLabel")}
    </span>
  );

  if (fileUrl) {
    return (
      <a href={fileUrl} download className={outerClass}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href(SiteConfig.downloadPage)} className={outerClass}>
      {inner}
    </Link>
  );
}
