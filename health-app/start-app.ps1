Write-Host "🚀 Starting GENIBI Health App..." -ForegroundColor Green
Write-Host ""

# Get the current directory
$currentDir = Get-Location
$htmlFile = Join-Path $currentDir "index.html"

Write-Host "📱 Opening GENIBI Health App in your browser..." -ForegroundColor Cyan
Write-Host "File location: $htmlFile" -ForegroundColor Yellow
Write-Host ""

# Try to open the HTML file
try {
    Start-Process $htmlFile
    Write-Host "✅ GENIBI Health App opened successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Could not open automatically. Please open this file manually:" -ForegroundColor Red
    Write-Host "$htmlFile" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 For best experience, use Chrome, Firefox, or Edge" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 If you encounter any issues, make sure JavaScript is enabled in your browser" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to exit"
