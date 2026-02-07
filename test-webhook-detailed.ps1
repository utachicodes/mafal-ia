$body = @{
    messages = @(
        @{
            from = "221770000000"
            id   = "test_msg_$(Get-Date -Format 'yyyyMMddHHmmss')"
            text = @{ body = "Bonjour, je voudrais voir le menu s'il vous plaît" }
        }
    )
    to       = "221771234567"
} | ConvertTo-Json -Depth 4

Write-Host "Sending webhook request to http://localhost:3002/api/whatsapp" -ForegroundColor Cyan
Write-Host "Message: 'Bonjour, je voudrais voir le menu s'il vous plaît'" -ForegroundColor Cyan
Write-Host "From: 221770000000 -> To: 221771234567" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/whatsapp" -Method Post -ContentType "application/json" -Body $body
    Write-Host "✓ Webhook Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 4
    Write-Host ""
    Write-Host "✓ Webhook endpoint is working!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Check the server logs to see if:" -ForegroundColor Yellow
    Write-Host "  1. The message was received" -ForegroundColor Yellow
    Write-Host "  2. AI generated a response" -ForegroundColor Yellow
    Write-Host "  3. The response was sent back" -ForegroundColor Yellow
}
catch {
    Write-Host "✗ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
