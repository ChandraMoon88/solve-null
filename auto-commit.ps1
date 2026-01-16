# Auto-commit and push script for SOLVE NULL
# Run this script to automatically commit and push changes to GitHub

Write-Host "🚀 Starting auto-commit watcher for SOLVE NULL..." -ForegroundColor Cyan
Write-Host "📁 Watching directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host "⏸️  Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

$lastCommitTime = Get-Date

while ($true) {
    Start-Sleep -Seconds 30
    
    # Check for changes
    $status = git status --porcelain
    
    if ($status) {
        Write-Host "📝 Changes detected at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
        
        # Stage all changes
        git add .
        
        # Create commit with timestamp
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Auto-commit: $timestamp"
        
        # Push to GitHub
        Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Cyan
        git push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
            Write-Host "🔄 Vercel will auto-deploy in ~1-2 minutes" -ForegroundColor Magenta
            $lastCommitTime = Get-Date
        } else {
            Write-Host "❌ Failed to push. Check your connection." -ForegroundColor Red
        }
        
        Write-Host ""
    }
}
