# 维护者发布清单

1. 同步修改 `package.json` 与 `src-tauri/tauri.conf.json` 中的版本号。
2. 运行 `npm run check && npm run build`。
3. 提交并推送主分支。
4. 打标签 `app-vX.Y.Z` 并推送。
5. 在 GitHub Actions 检查 macOS 与 Windows 两个 job 均已成功。
6. 在 GitHub Release 下载 `.dmg` / `.exe` 进行一次真实安装验证。

macOS 直接下载的未签名应用可能提示“无法验证开发者”；发布给更广泛用户前，应为 CI 配置 Apple Developer 证书和 notarization。Windows 同样建议配置 Authenticode 代码签名证书，降低 SmartScreen 警告。
