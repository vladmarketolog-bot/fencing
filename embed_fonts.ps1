
$baseDir = "c:\Users\VLAD\Documents\GitHub\fencing\css\fonts"
$outputFile = "c:\Users\VLAD\Documents\GitHub\fencing\css\fonts_embedded.css"

$fonts = @(
    @{ Family = 'Manrope'; Style = 'normal'; Weight = '400'; File = 'Manrope-Regular.ttf' },
    @{ Family = 'Manrope'; Style = 'normal'; Weight = '500'; File = 'Manrope-Medium.ttf' },
    @{ Family = 'Manrope'; Style = 'normal'; Weight = '700'; File = 'Manrope-Bold.ttf' },
    @{ Family = 'Manrope'; Style = 'normal'; Weight = '800'; File = 'Manrope-ExtraBold.ttf' },
    @{ Family = 'JetBrains Mono'; Style = 'normal'; Weight = '400'; File = 'JetBrainsMono-Regular.ttf' },
    @{ Family = 'JetBrains Mono'; Style = 'normal'; Weight = '700'; File = 'JetBrainsMono-Bold.ttf' }
)

$cssContent = ""

foreach ($font in $fonts) {
    $filePath = Join-Path $baseDir $font.File
    Write-Host "Processing $($font.File)..."
    try {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $encoded = [System.Convert]::ToBase64String($bytes)
        
        $cssRule = "@font-face {
  font-family: '$($font.Family)';
  font-style: $($font.Style);
  font-weight: $($font.Weight);
  font-display: swap;
  src: url('data:font/ttf;charset=utf-8;base64,$encoded') format('truetype');
}"
        $cssContent += $cssRule + "`n`n"
    }
    catch {
        Write-Error "Error processing $($font.File): $_"
    }
}

[System.IO.File]::WriteAllText($outputFile, $cssContent)
Write-Host "Successfully created $outputFile"
