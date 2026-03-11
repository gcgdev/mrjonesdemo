# Mr. Jones Barbearia - Landing Page SEO Local

Landing page institucional com foco em SEO local para duas unidades:
- Guaratingueta
- Aparecida

Inclui pre-agendamento com redirecionamento para WhatsApp, paginas locais por unidade e mapas com carregamento sob clique (privacy-first).

## Estrutura

```txt
/
|-- index.html
|-- robots.txt
|-- sitemap.xml
|-- maps-guara.png
|-- maps-aparecida.png
|-- assets/
|   |-- site.css
|   |-- site.js
|   `-- img/
|-- unidades/
|   |-- index.html
|   |-- guaratingueta/index.html
|   `-- aparecida/index.html
`-- servicos/index.html
```

## Publicacao no GitHub

1. Crie o repositorio vazio no GitHub.
2. No projeto local, rode:

```bash
git init
git add .
git commit -m "feat: landing Mr. Jones otimizada para SEO local"
git branch -M main
git remote add origin <URL_DO_REPOSITORIO>
git push -u origin main
```

## Checklist antes de publicar

1. Substituir `https://SEU-DOMINIO.com.br` em:
- `index.html`
- `unidades/guaratingueta/index.html`
- `unidades/aparecida/index.html`

2. Atualizar `sitemap.xml` com o dominio final.
3. Garantir que `robots.txt` aponta para o sitemap correto.
4. Testar formulario de pre-agendamento (abertura do WhatsApp por unidade).
5. Validar no Lighthouse sem clicar em "Carregar mapa" (para nao disparar cookies do embed durante o teste).

## Rodar localmente

Opcao simples com Python:

```bash
python -m http.server 8080
```

Acesse: `http://localhost:8080`

## Observacoes tecnicas

- Mapas usam capa (`maps-guara.png` e `maps-aparecida.png`) + botao "Carregar mapa".
- O iframe real do Google Maps so e criado via JavaScript apos clique do usuario.
- Isso reduz alertas de third-party cookies no carregamento inicial.
