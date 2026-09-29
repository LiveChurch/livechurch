# update-server

Projeto separado do app (tem o próprio `package.json`): a CLI que gera, assina e publica os releases. Não há
servidor: tudo fica no repositório público
[LiveChurch/livechurch](https://github.com/LiveChurch/livechurch):

- **binários** no GitHub Releases (um release `v<versão>` por versão, com os arquivos de cada plataforma);
- **um manifesto por plataforma** versionado em `releases/` (`releases/win32-x64.json`, `releases/linux-x64.json`...), que o app baixa.

## Comandos (da raiz do app)

Passo a passo:

```bash
bun run release:version [patch|minor|major|current|x.y.z]   # 1. cria a versão (padrão: patch)
bun run release:asar                                        # 2. gera o .asar (atualização dos apps instalados)
bun run release:exe:win                                     # 3. gera o executável Windows (numa máquina Windows)
bun run release:exe:linux                                   #    gera o executável Linux (numa máquina Linux)
bun run release:publish [--full] [--notes "texto"]          # 4. sobe o .asar, o executável e o manifesto
```

Tudo de uma vez, para um sistema:

```bash
bun run release:win   [versão] [--full] [--notes "texto"]
bun run release:linux [versão] [--full] [--notes "texto"]
```

`release:win` e `release:linux` fazem os passos 1 a 4 em sequência; se algo falhar, a versão volta à anterior.
Uma vez por máquina: `cd update-server && bun install`; para gerar as chaves que assinam os releases,
`bun run --cwd update-server keys` (ver [Segurança](#segurança)).

O app baixa `https://raw.githubusercontent.com/LiveChurch/livechurch/main/releases/<plataforma>.json`
(`electron/update/UpdateConfig.ts`; em testes, `LIVECHURCH_UPDATE_URL` troca a base da URL). Ele confere 10 s
depois de abrir e a cada hora, e há "Ajuda → Verificar atualizações". O GitHub guarda esse arquivo em cache por
até 5 min, então um release novo pode demorar esse tempo para aparecer.

## Configuração (uma vez por máquina)

`gh` (GitHub CLI: `winget install GitHub.cli` no Windows) e `gh auth login`, com uma conta com permissão de
escrita em `LiveChurch/livechurch`. O repositório precisa ter ao menos um commit, senão o GitHub não
cria releases. Outro repositório: `LIVECHURCH_RELEASES_REPO=dono/repo` (e troque `MANIFEST_BASE_URL` no app).

## Os passos

1. **`release:version`**: grava a versão no `package.json` do app. `current` mantém a atual.
2. **`release:asar`**: compila o renderer (Vite, com os chunks do app ofuscados), o main (ofuscado e em
   bytecode, `main.jsc`, com o Electron do app) e o preload em `build/bundle/`, e empacota em
   `build/livechurch-<versão>.asar`.
3. **`release:exe:win` / `release:exe:linux`**: roda o electron-builder sobre o mesmo `build/bundle/` (se ele
   for de outra versão, monta de novo) e gera o `.exe` / `.AppImage` em `release/` (ou `~/LiveChurch-release`
   se o projeto estiver no OneDrive, onde o electron-builder falha com EPERM; `LIVECHURCH_INSTALLER_DIR`
   escolhe outra pasta). Só roda no próprio sistema.
4. **`release:publish`**: confere o `gh`, envia ao release `v<versão>` (criando-o se preciso) o que foi gerado
   para a versão atual e, só depois, grava `releases/<plataforma>.json` no repositório com um commit direto na `main`:
   - `livechurch-setup-<versão>-<plataforma>.exe|.AppImage`: instalador, para quem ainda não tem o app;
   - `livechurch-code-<versão>-<plataforma>.asar`: atualização dos apps instalados.

   O manifesto aponta para o `.asar` (`type: "code"`). Com `--full`, aponta para o instalador (`type: "full"`):
   use quando o **Electron mudar**, porque o bytecode do `.asar` só roda no Electron com que foi compilado.
   Sem o executável, sobe só o `.asar`; com `--full`, o executável é obrigatório.

## Várias plataformas na mesma versão

Cada sistema é gerado na própria máquina (o bytecode e o instalador são por sistema) e só mexe nos próprios
arquivos e no próprio manifesto. Para publicar o Linux na versão que o Windows acabou de criar:

```bash
# Windows
bun run release:win --notes "Correções"   # cria a 0.0.10 e publica o Windows
# (commit do package.json)

# Linux, com o mesmo código (git pull)
bun run release:linux current             # mantém a 0.0.10 e acrescenta o Linux ao release v0.0.10
```

As notas do release no GitHub são as do primeiro envio; `--notes` sempre vai para o manifesto da plataforma.

## Manifesto (`releases/<plataforma>.json`)

```json
{
  "platform": "win32-x64",
  "version": "0.0.7",
  "type": "code",
  "bundleUrl": "https://github.com/LiveChurch/livechurch/releases/download/v0.0.7/livechurch-code-0.0.7-win32-x64.asar",
  "sha256": "…",
  "signature": "…",
  "size": 19407973,
  "electronVersion": "37.10.3",
  "notes": "texto opcional",
  "publishedAt": "2026-09-21T17:31:28.929Z"
}
```

- `type: "code"`: só o código do app, em um `bundle.asar`. O app o baixa e o carrega ao reiniciar. Só vale para instalações com o mesmo Electron (`electronVersion`).
- `type: "full"`: instalador completo. O app o baixa e o abre.
- Sem o arquivo da plataforma (`404`), o app entende que não há atualização.

## Segurança

O app não tem assinatura de código, então ele mesmo confere cada release: a assinatura Ed25519 (sobre
`plataforma|versão|tipo|sha256`) com a chave pública embutida em `electron/update/publicKey.ts` e o SHA-256 do
arquivo baixado. Por isso quem hospeda os arquivos não precisa ser confiável. A chave privada fica em
`update-server/keys/private.pem` (ignorada pelo git): guarde uma cópia fora da pasta do projeto (e leve-a à
máquina Linux para publicar de lá). Gerar outra chave (`keys --force`) invalida os apps já instalados.
