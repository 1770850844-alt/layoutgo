import type { Card } from './types';

const clean = (html: string) => new DOMParser().parseFromString(html, 'text/html').body.textContent?.replace(/\s+/g, ' ').trim() ?? '';

export function makeCards(title: string, html: string): Card[] {
  const text = clean(html);
  const sentences = text.split(/[。！？]/).map((item) => item.trim()).filter((item) => item.length > 8);
  const snippets = (sentences.length ? sentences : [text]).slice(0, 4);
  return snippets.map((body, index) => ({
    id: crypto.randomUUID(),
    index: index + 1,
    title: index === 0 ? title : ['先记住这一句', '把它做得更简单', '留白，才有新的感觉'][index - 1] ?? title,
    body,
    theme: (['cover', 'quote', 'list', 'memo'] as const)[index % 4]
  }));
}

export function cardSvg(card: Card, brandName: string, accent: string): string {
  const esc = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char] ?? char));
  const wrap = (value: string, limit: number) => value.match(new RegExp(`.{1,${limit}}`, 'g'))?.slice(0, 4) ?? [value];
  const dark = card.theme === 'memo';
  const background = card.theme === 'cover' ? accent : card.theme === 'quote' ? '#F2DEA3' : card.theme === 'list' ? '#E2F09B' : '#26312C';
  const text = dark ? '#FFF9ED' : '#202923';
  const title = wrap(card.title, 11).map((line, index) => `<text x="96" y="${260 + index * 72}" font-size="62" font-family="serif" font-weight="700">${esc(line)}</text>`).join('');
  const body = wrap(card.body, 20).map((line, index) => `<text x="96" y="${610 + index * 34}" font-size="24" font-family="sans-serif">${esc(line)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1440" viewBox="0 0 1080 1440"><rect width="1080" height="1440" fill="${background}"/><rect x="96" y="86" width="888" height="1" fill="${dark ? '#BFCBC2' : '#405148'}" opacity=".5"/><text x="96" y="146" fill="${text}" font-size="19" font-family="monospace" letter-spacing="4">${esc(brandName.toUpperCase())} / KNOWLEDGE</text><g fill="${text}">${title}${body}</g><text x="96" y="1320" fill="${text}" font-size="20" font-family="monospace">0${card.index}</text><text x="984" y="1320" fill="${text}" text-anchor="end" font-size="20" font-family="monospace">${esc(brandName)}</text></svg>`;
}
