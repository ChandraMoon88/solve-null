# Script to add translation support to all level files
# This adds useTranslation import and updates common UI buttons

$levelFiles = @(
  "src\app\level\0\page.tsx",
  "src\app\level\1\page.tsx",
  "src\app\level\2\page.tsx",
  "src\app\level\3\page.tsx",
  "src\app\level\4\page.tsx",
  "src\app\level\5\page.tsx",
  "src\app\level\6\page.tsx",
  "src\app\level\7\page.tsx",
  "src\app\level\8\page.tsx",
  "src\app\level\9\page.tsx",
  "src\app\level\10\page.tsx"
)

foreach ($file in $levelFiles) {
    $fullPath = Join-Path (Get-Location) $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # Add import if not exists
        if ($content -notmatch "useTranslation") {
            $content = $content -replace "import HintsButton from '@/components/HintsButton'", "import HintsButton from '@/components/HintsButton'`nimport { useTranslation } from '@/hooks/useTranslation'"
            
            # Add hook declaration after "export default function"
            $content = $content -replace "(export default function \w+\(\) \{)", "`$1`n  const { t } = useTranslation()"
            
            # Replace common button text
            $content = $content -replace '"Return to Levels"', 't.levelUI.returnToLevels'
            $content = $content -replace "'Return to Levels'", 't.levelUI.returnToLevels'
            $content = $content -replace '"Next Level"', 't.levelUI.nextLevel'
            $content = $content -replace '"Continue to Level"', 't.levelUI.nextLevel'
            
            Set-Content -Path $fullPath -Value $content
            Write-Host "✅ Updated: $file" -ForegroundColor Green
        } else {
            Write-Host "⏭️  Skipped (already has translation): $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✨ Translation support added to all levels!" -ForegroundColor Cyan
Write-Host "Note: Full content translation requires manual updates for narrative text." -ForegroundColor Gray
