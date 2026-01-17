# Comprehensive Level Translation Updater
# Updates all level pages to use translation system for ALL text content

Write-Host "🌐 Comprehensive Translation Update for All Levels" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

$levelsToUpdate = @(
    @{ Level = 0; HasNarrative = $true },
    @{ Level = 1; HasNarrative = $true },
    @{ Level = 2; HasNarrative = $true },
    @{ Level = 3; HasNarrative = $true },
    @{ Level = 4; HasNarrative = $true },
    @{ Level = 5; HasNarrative = $true },
    @{ Level = 6; HasNarrative = $true },
    @{ Level = 7; HasNarrative = $true },
    @{ Level = 8; HasNarrative = $true },
    @{ Level = 9; HasNarrative = $true },
    @{ Level = 10; HasNarrative = $true }
)

$totalUpdates = 0
$successCount = 0

foreach ($levelInfo in $levelsToUpdate) {
    $level = $levelInfo.Level
    $filePath = ".\src\app\level\$level\page.tsx"
    
    if (Test-Path $filePath) {
        Write-Host "`n📄 Processing Level $level..." -ForegroundColor Yellow
        
        $content = Get-Content $filePath -Raw
        $modified = $false
        
        # Ensure useTranslation hook is properly declared at component start
        if ($content -match "export default function Level\d+Page\(\).*\{") {
            if ($content -notmatch "const\s*\{\s*t\s*\}\s*=\s*useTranslation\(\)") {
                Write-Host "  ✓ Adding useTranslation hook" -ForegroundColor Green
                $content = $content -replace "(export default function Level\d+Page\(\).*\{)", "`$1`n  const { t } = useTranslation()"
                $modified = $true
            }
        }
        
        # Common string replacements for all levels
        $stringReplacements = @{
            # UI Elements
            '"Return to Levels"' = '{t.levelUI.returnToLevels}'
            "'Return to Levels'" = '{t.levelUI.returnToLevels}'
            '"Next Level"' = '{t.levelUI.nextLevel}'
            "'Next Level'" = '{t.levelUI.nextLevel}'
            '"Complete Level"' = '{t.levelUI.completeLevel}'
            "'Complete Level'" = '{t.levelUI.completeLevel}'
            '"Continue"' = '{t.levelUI.continue}'
            "'Continue'" = '{t.levelUI.continue}'
            '"Retry"' = '{t.levelUI.retry}'
            "'Retry'" = '{t.levelUI.retry}'
            '"Reset"' = '{t.levelUI.reset}'
            "'Reset'" = '{t.levelUI.reset}'
            '"Loading..."' = '{t.levelUI.loading}'
            "'Loading...'" = '{t.levelUI.loading}'
            '"Proceed to Level NULL"' = '{t.levelUI.nextLevel}'
            "'Proceed to Level NULL'" = '{t.levelUI.nextLevel}'
        }
        
        foreach ($key in $stringReplacements.Keys) {
            if ($content -match [regex]::Escape($key)) {
                $content = $content -replace [regex]::Escape($key), $stringReplacements[$key]
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content -Path $filePath -Value $content -NoNewline
            $successCount++
            Write-Host "  ✅ Level $level updated successfully" -ForegroundColor Green
        } else {
            Write-Host "  ℹ️  Level $level - No changes needed" -ForegroundColor Gray
        }
        
        $totalUpdates++
    } else {
        Write-Host "  ⚠️  Level $level file not found" -ForegroundColor Red
    }
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "✨ Update Complete!" -ForegroundColor Cyan
Write-Host "  Total Levels Processed: $totalUpdates" -ForegroundColor White
Write-Host "  Successfully Updated: $successCount" -ForegroundColor Green
Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Run 'npm run build' to verify" -ForegroundColor White
Write-Host "  2. Test language switching on all levels" -ForegroundColor White
Write-Host "  3. Check browser console for any errors" -ForegroundColor White
