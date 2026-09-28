import { CueLabel } from "@/components/ui/CueLabel";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { SiteConfig } from "@/core/constants/SiteConfig";
import type { DownloadForm } from "./useDownloadForm";

const INPUT_CLASS =
  "rounded-lg border border-edge bg-surface px-4 py-3 text-fg placeholder:text-dim/60 focus:border-ember";

/** Name and email where we will send the link; after sending, the confirmation replaces the form. */
export function LeadForm({ form }: { form: DownloadForm }) {
  const { platform, version, name, setName, email, setEmail, status, submit, errorMessage } = form;

  return (
    <section className="flex flex-col gap-5">
      <CueLabel cue="03" label="Seus dados" className="text-accent" />

      {status === "done" ? (
        <div role="status" className="flex flex-col gap-2 rounded-xl border border-ember bg-ember/10 p-5">
          <p className="text-lg font-semibold">Recebemos seu pedido!</p>
          <p className="text-dim">
            Em breve você receberá o link de download por e-mail, no endereço {email.trim()}.
            {SiteConfig.senderEmail && ` Ele será enviado por ${SiteConfig.senderEmail}; se não o encontrar, olhe também a caixa de spam.`}
          </p>
        </div>
      ) : (
        <form className="flex flex-col items-start gap-5" onSubmit={submit}>
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <label className="flex flex-1 flex-col gap-2 text-sm font-medium">
              Nome
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                placeholder="Seu nome"
                className={INPUT_CLASS}
              />
            </label>
            <label className="flex flex-1 flex-col gap-2 text-sm font-medium">
              E-mail
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                name="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="voce@exemplo.com"
                className={INPUT_CLASS}
              />
            </label>
          </div>

          <DownloadButton submit disabled={status === "sending"}>
            {status === "sending" ? "Enviando..." : `Quero o link para ${platform.label} v${version}`}
          </DownloadButton>

          {status === "error" && (
            <p role="alert" className="text-sm font-medium text-accent">
              {errorMessage}
            </p>
          )}
        </form>
      )}

      <p className="text-dim">{platform.installHint}</p>
      {SiteConfig.senderEmail && (
        <p className="text-sm text-dim">
          O link será enviado por <strong className="font-semibold text-fg">{SiteConfig.senderEmail}</strong>.
        </p>
      )}
      <p className="text-xs text-dim">Usamos seu nome e e-mail para enviar o link e falar com você sobre o LiveChurch.</p>
    </section>
  );
}
