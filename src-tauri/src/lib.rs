use keyring::Entry;
use serde_json::{json, Value};

const SERVICE: &str = "com.papersignal.desktop";

fn entry(provider_id: &str) -> Result<Entry, String> {
  Entry::new(SERVICE, provider_id).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_api_key(provider_id: String, api_key: String) -> Result<(), String> {
  if provider_id.trim().is_empty() || api_key.trim().is_empty() { return Err("服务商和 API Key 不能为空".into()); }
  entry(&provider_id)?.set_password(&api_key).map_err(|error| error.to_string())
}

#[tauri::command]
fn has_api_key(provider_id: String) -> bool {
  entry(&provider_id).and_then(|item| item.get_password().map_err(|error| error.to_string())).is_ok()
}

#[tauri::command]
fn delete_api_key(provider_id: String) -> Result<(), String> {
  entry(&provider_id)?.delete_credential().map_err(|error| error.to_string())
}

#[tauri::command]
async fn generate_content(provider_id: String, base_url: String, model: String, prompt: String) -> Result<String, String> {
  let api_key = entry(&provider_id)?.get_password().map_err(|_| "未找到此服务商的 API Key，请先在 AI 设置中保存。".to_string())?;
  let url = format!("{}/chat/completions", base_url.trim_end_matches('/'));
  let body = json!({
    "model": model,
    "temperature": 0.7,
    "messages": [
      { "role": "system", "content": "你是中文内容编辑助手。严格遵守用户要求，输出可直接使用的中文内容。" },
      { "role": "user", "content": prompt }
    ]
  });
  let response = reqwest::Client::new().post(url).bearer_auth(api_key).json(&body).send().await.map_err(|error| format!("请求失败：{error}"))?;
  let status = response.status();
  let payload: Value = response.json().await.map_err(|error| format!("响应解析失败：{error}"))?;
  if !status.is_success() { return Err(payload.get("error").and_then(|value| value.get("message")).and_then(Value::as_str).unwrap_or("服务商返回错误").to_string()); }
  payload.get("choices").and_then(|value| value.get(0)).and_then(|value| value.get("message")).and_then(|value| value.get("content")).and_then(Value::as_str).map(str::to_owned).ok_or_else(|| "服务商未返回可用内容".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default().build())
    .invoke_handler(tauri::generate_handler![save_api_key, has_api_key, delete_api_key, generate_content])
    .run(tauri::generate_context!())
    .expect("error while running PaperSignal");
}
