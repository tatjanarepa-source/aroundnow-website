# Morning research run (Windows Task Scheduler "AroundNow morning research", daily 07:00).
# Starts Chrome (Claude in Chrome needs it open), pulls the night run's commits, then runs Claude Code unattended with
# the instructions in scripts/morning-research.md. Output: Documents\AroundNow-Research-Logs\<date>.log
# Claude may research, write batch files, edit research notes and commit; it can't import, deploy or push.

$ErrorActionPreference = "Continue"
$repo = Split-Path -Parent $PSScriptRoot
$logDir = Join-Path $env:USERPROFILE "Documents\AroundNow-Research-Logs"
New-Item -ItemType Directory -Force $logDir | Out-Null
$log = Join-Path $logDir ((Get-Date -Format "yyyy-MM-dd") + ".log")
Set-Location $repo

"=== Morning research $(Get-Date -Format 'yyyy-MM-dd HH:mm') ===" | Out-File -Append -Encoding utf8 $log

if (-not (Get-Process chrome -ErrorAction SilentlyContinue)) {
  Start-Process "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
  Start-Sleep -Seconds 20 # let the Claude in Chrome extension connect
}

git pull --ff-only 2>&1 | Out-File -Append -Encoding utf8 $log

$prompt = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot "morning-research.md")
$allowed = @("Read", "Write", "Edit", "Glob", "Grep", "Agent", "SendMessage", "Bash", "ToolSearch", "mcp__claude-in-chrome")
$blocked = @("Bash(npm run import:listings:*)", "Bash(npm run deploy:*)", "Bash(npx wrangler:*)", "Bash(git push:*)",
  "Bash(node --env-file=.env scripts/import-listings.mjs:*)")

& "C:\nvm4w\nodejs\claude.cmd" -p $prompt --chrome --allowedTools $allowed --disallowedTools $blocked 2>&1 |
  Out-File -Append -Encoding utf8 $log
"=== Finished $(Get-Date -Format 'HH:mm') ===" | Out-File -Append -Encoding utf8 $log
