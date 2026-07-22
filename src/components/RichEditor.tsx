import { Bold, Code2, Heading2, ImagePlus, Italic, List, Quote, RemoveFormatting, SeparatorHorizontal } from 'lucide-react';
import { useRef } from 'react';

interface Props { html: string; onChange: (html: string) => void; }

const actions = [
  ['bold', Bold, '加粗'], ['italic', Italic, '斜体'], ['formatBlock', Heading2, '标题'], ['insertUnorderedList', List, '列表'],
  ['formatBlock', Quote, '引用'], ['insertHorizontalRule', SeparatorHorizontal, '分隔线'], ['formatBlock', Code2, '代码块'], ['removeFormat', RemoveFormatting, '清除样式']
] as const;

export function RichEditor({ html, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const run = (command: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, value ?? (command === 'formatBlock' ? 'h2' : undefined));
    if (ref.current) onChange(ref.current.innerHTML);
  };
  const addImage = () => {
    const url = window.prompt('请输入图片地址');
    if (url) run('insertImage', url);
  };
  return <section className="editor-surface" aria-label="文章编辑器">
    <div className="toolbar" role="toolbar" aria-label="富文本工具栏">
      {actions.map(([command, Icon, label]) => <button key={label} type="button" title={label} aria-label={label} onMouseDown={(event) => { event.preventDefault(); run(command); }}><Icon size={15} strokeWidth={1.8} /></button>)}
      <i />
      <button type="button" title="插入图片" aria-label="插入图片" onMouseDown={(event) => { event.preventDefault(); addImage(); }}><ImagePlus size={15} /></button>
    </div>
    <div ref={ref} className="rich-editor" contentEditable suppressContentEditableWarning onInput={(event) => onChange(event.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: html }} />
  </section>;
}
