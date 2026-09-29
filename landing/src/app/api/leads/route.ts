import { LeadRepository } from "@/server/LeadRepository";
import { LeadValidator } from "@/server/LeadValidator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const lead = LeadValidator.parse(body);
  if (!lead) {
    return Response.json({ error: "Dados inválidos." }, { status: 400 });
  }

  try {
    await LeadRepository.insert(lead);
  } catch (error) {
    console.error("Falha ao gravar o lead do download", error);
    return Response.json({ error: "Não foi possível registrar seus dados." }, { status: 500 });
  }
  return Response.json({ ok: true }, { status: 201 });
}
