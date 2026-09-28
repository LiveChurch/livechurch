"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PLATFORMS, RELEASE_VERSIONS, type PlatformId } from "@/core/content/releases";
import { LeadService } from "@/core/services/LeadService";
import { PlatformUtils } from "@/core/utils/PlatformUtils";

export type LeadFormStatus = "idle" | "sending" | "error" | "done";

const REGISTER_ERROR_MESSAGE = "Não foi possível registrar seus dados agora. Tente novamente.";

/** Choice of system and version + name and email of whoever will receive the download link. */
export function useDownloadForm() {
  const [detectedPlatformId, setDetectedPlatformId] = useState<PlatformId | null | undefined>(undefined);
  const [platformId, setPlatformId] = useState<PlatformId>("windows");
  const [version, setVersion] = useState(RELEASE_VERSIONS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LeadFormStatus>("idle");

  // The system is only known in the browser; detecting it here avoids a hydration mismatch.
  useEffect(() => {
    const detected = PlatformUtils.detect();
    setDetectedPlatformId(detected);
    if (detected) setPlatformId(detected);
  }, []);

  const platform = PLATFORMS.find((item) => item.id === platformId) ?? PLATFORMS[0];

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    try {
      await LeadService.register({
        name: name.trim(),
        email: email.trim(),
        platform: platformId,
        version,
      });
      setStatus("done");
    } catch (error) {
      console.error("Falha ao registrar o pedido de download", error);
      setStatus("error");
    }
  }

  return {
    detectedPlatformId,
    platform,
    version,
    setPlatformId,
    setVersion,
    name,
    setName,
    email,
    setEmail,
    status,
    submit,
    errorMessage: REGISTER_ERROR_MESSAGE,
  };
}

export type DownloadForm = ReturnType<typeof useDownloadForm>;
