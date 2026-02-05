# Push to GitHub and create Release v3.0.6
# Run this script in PowerShell from this folder.
# You will be asked once to authorize "workflow" scope in the browser.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Step 1: Refresh GitHub token (workflow scope) - complete in browser if prompted." -ForegroundColor Cyan
gh auth refresh -h github.com -s workflow

Write-Host "`nStep 2: Push master branch..." -ForegroundColor Cyan
git push -u origin master

Write-Host "`nStep 3: Push tag v3.0.6..." -ForegroundColor Cyan
git push origin v3.0.6

Write-Host "`nStep 4: Create GitHub Release v3.0.6..." -ForegroundColor Cyan
gh release create v3.0.6 --notes-file release_notes_v3.0.6.md

Write-Host "`nDone. Repo: https://github.com/HirezRa/n8n-nodes-blossom" -ForegroundColor Green
