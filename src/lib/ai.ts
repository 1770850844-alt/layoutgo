import { invokeDesktop, isDesktop } from './desktop';

export interface AiConfig { providerId: string; baseUrl: string; model: string; }

export async function saveApiKey(providerId: string, apiKey: string): Promise<void> {
  if (!isDesktop()) throw new Error('AI Key 仅支持在桌面版中保存。');
  await invokeDesktop('save_api_key', { providerId, apiKey });
}

export async function deleteApiKey(providerId: string): Promise<void> {
  if (!isDesktop()) return;
  await invokeDesktop('delete_api_key', { providerId });
}

export async function hasApiKey(providerId: string): Promise<boolean> {
  if (!isDesktop()) return false;
  return invokeDesktop<boolean>('has_api_key', { providerId });
}

export async function generateWithAi(config: AiConfig, prompt: string): Promise<string> {
  if (!isDesktop()) throw new Error('请在 PaperSignal 桌面版配置自己的 API Key 后使用 AI。');
  return invokeDesktop<string>('generate_content', { ...config, prompt });
}
