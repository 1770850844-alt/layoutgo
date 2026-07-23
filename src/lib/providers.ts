import type { AiService } from './types';

export interface ProviderPreset {
  id: string;
  name: string;
  baseUrl: string;
  model: string;
}

export const providers: ProviderPreset[] = [
  { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { id: 'zhipu', name: '智谱 AI', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-5' },
  { id: 'kimi', name: 'Kimi / Moonshot', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
  { id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com', model: 'deepseek-v4-flash' },
  { id: 'custom', name: '自定义兼容服务', baseUrl: '', model: '' }
];

export const getProvider = (id: string) => providers.find((provider) => provider.id === id) ?? providers[0];

export function refreshProviderDefaults(services: AiService[]): AiService[] {
  return services.map((service) => {
    const usesRetiredDeepSeekDefault = service.providerId === 'deepseek'
      && service.baseUrl === 'https://api.deepseek.com/v1'
      && service.model === 'deepseek-chat';
    if (!usesRetiredDeepSeekDefault) return service;
    return {
      ...service,
      baseUrl: 'https://api.deepseek.com',
      model: 'deepseek-v4-flash',
      lastTestStatus: 'untested',
      lastTestMessage: 'DeepSeek 默认模型已更新，请重新测试后使用。',
      lastTestedAt: undefined
    };
  });
}
