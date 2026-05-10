# Generates deploy.zip for GoDaddy PaaS upload
# Run: .\build.ps1

$output = "deploy.zip"
$files  = @("package.json", "package-lock.json", "start.js", ".gitignore", ".env.example")

if (Test-Path $output) { Remove-Item $output -Force }

Compress-Archive -Path $files -DestinationPath $output -CompressionLevel Optimal

$sizeMB = [math]::Round((Get-Item $output).Length / 1MB, 2)
Write-Host "Built: $output ($sizeMB MB)"

if ($sizeMB -gt 100) {
    Write-Warning "ZIP exceeds GoDaddy 100 MB limit!"
} else {
    Write-Host "Ready to upload to GoDaddy PaaS."
}
