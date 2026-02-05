$files = Get-ChildItem -Recurse -Filter *.html
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace '<script src="js/tailwindcss.js"></script>', '<link href="css/output.css" rel="stylesheet">'
    $newContent = $newContent -replace '<script src="\.\./js/tailwindcss.js"></script>', '<link href="../css/output.css" rel="stylesheet">'
    
    if ($content -ne $newContent) {
        $newContent | Set-Content $file.FullName -Encoding UTF8
        Write-Host "Updated $($file.Name)"
    }
}
