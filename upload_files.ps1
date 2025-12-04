$token = "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"
$owner = "roynoTIC"
$repo = "voting-system-ia"
$branch = "main"

$files = @("index.html", "app.js", "data.js", "styles.css", "README.md", ".gitignore")

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file)
    $base64 = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))
    
    $url = "https://api.github.com/repos/$owner/$repo/contents/$file"
    $headers = @{
        "Authorization" = "token $token"
        "Accept" = "application/vnd.github+json"
    }
    
    $body = @{
        "message" = "Add $file"
        "content" = $base64
        "branch" = $branch
    } | ConvertTo-Json
    
    Write-Host "Uploading $file..."
    try {
        $response = Invoke-RestMethod -Uri $url -Method Put -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "✅ $file uploaded"
    } catch {
        Write-Host "❌ Error uploading $file: $_"
    }
}

Write-Host "Done!"
