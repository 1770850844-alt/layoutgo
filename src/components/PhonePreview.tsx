import type { Brand, Card, Platform, PreviewMode, TemplateId } from '../lib/types';

interface Props { mode: PreviewMode; platform: Platform; template: TemplateId; html: string; cards: Card[]; brand: Brand; onCard: (card: Card) => void; }

export function PhonePreview({ mode, platform, template, html, cards, brand, onCard }: Props) {
  return <div className={`phone ${platform}`}>
    <div className="phone-status"><span>9:41</span><span className="island" /><span>●●●</span></div>
    <div className="phone-nav"><span>‹</span><b>{platform === 'wechat' ? brand.name : <>小红书 <em>RED</em></>}</b><span>•••</span></div>
    {mode === 'article' ? <article className={`article-preview ${template}`} dangerouslySetInnerHTML={{ __html: html }} /> : <section className="cards-preview" aria-label="小红书卡片预览">
      {cards.map((card) => <button className={`xhs-card ${card.theme}`} key={card.id} onClick={() => onCard(card)} type="button">
        <span>{brand.name.toUpperCase()} / KNOWLEDGE</span><h3>{card.title}</h3><p>{card.body}</p><footer><b>0{card.index}</b><b>{brand.name}</b></footer>
      </button>)}
      <p className="card-hint">继续下滑查看全部卡片</p>
    </section>}
    <span className="home-indicator" />
  </div>;
}
