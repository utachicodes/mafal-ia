$body = @{
    messages = @(
        @{
            from = "22177000000"
            id   = "msg123"
            text = @{ body = "Hello" }
        }
    )
    to       = "221771234567"
} | ConvertTo-Json -Depth 4

Invoke-RestMethod -Uri "http://localhost:3002/api/whatsapp" -Method Post -ContentType "application/json" -Body $body
