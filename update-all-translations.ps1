# Script to update all level files to use translations
Write-Host "🌐 Updating all levels with bilingual support..." -ForegroundColor Cyan

$levels = @(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

foreach ($level in $levels) {
    $filePath = ".\src\app\level\$level\page.tsx"
    
    if (Test-Path $filePath) {
        Write-Host "✓ Processing Level $level..." -ForegroundColor Green
        
        # Read the file content
        $content = Get-Content $filePath -Raw
        
        # Check if useTranslation is already imported
        if ($content -notmatch "import.*useTranslation") {
            Write-Host "  Adding useTranslation import..." -ForegroundColor Yellow
            $content = $content -replace "(import.*from 'lucide-react')", "`$1`nimport { useTranslation } from '@/hooks/useTranslation'"
        }
        
        # Check if translation hook is declared
        if ($content -notmatch "const.*\{.*t.*\}.*=.*useTranslation\(\)") {
            Write-Host "  Adding translation hook..." -ForegroundColor Yellow
            # Add after the component declaration
            $content = $content -replace "(export default function Level\d+Page\(\).*\{)", "`$1`n  const { t } = useTranslation()"
        }
        
        # Replace common button texts
        $replacements = @{
            '"Return to Levels"' = 't.levelUI.returnToLevels'
            "'Return to Levels'" = 't.levelUI.returnToLevels'
            '"Next Level"' = 't.levelUI.nextLevel'
            "'Next Level'" = 't.levelUI.nextLevel'
            '"Complete Level"' = 't.levelUI.completeLevel'
            "'Complete Level'" = 't.levelUI.completeLevel'
            '"Continue"' = 't.levelUI.continue'
            "'Continue'" = 't.levelUI.continue'
            '"Retry"' = 't.levelUI.retry'
            "'Retry'" = 't.levelUI.retry'
            '"Reset"' = 't.levelUI.reset'
            "'Reset'" = 't.levelUI.reset'
            '"Loading..."' = 't.levelUI.loading'
            "'Loading...'" = 't.levelUI.loading'
            '"Insights"' = 't.levelUI.insights'
            "'Insights'" = 't.levelUI.insights'
            '"Progress"' = 't.levelUI.progress'
            "'Progress'" = 't.levelUI.progress'
            '"Status"' = 't.levelUI.status'
            "'Status'" = 't.levelUI.status'
        }
        
        $changed = $false
        foreach ($key in $replacements.Keys) {
            if ($content -match $key) {
                $content = $content -replace $key, "{$($replacements[$key])}"
                $changed = $true
            }
        }
        
        if ($changed) {
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "  ✅ Level $level updated with translations" -ForegroundColor Green
        } else {
            Write-Host "  ℹ️  Level $level already up to date" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ⚠️  Level $level not found" -ForegroundColor Red
    }
}

Write-Host "`n🎉 All levels processed!" -ForegroundColor Cyan
Write-Host "✨ The app is now bilingual across all levels" -ForegroundColor Green
