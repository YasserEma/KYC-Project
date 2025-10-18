# PowerShell script to fix deleted_at: null assignments to use IsNull()

# List of files that need fixing
$files = @(
    "src\modules\entity-custom-fields\repositories\entity-custom-field.repository.ts",
    "src\modules\logs\repositories\log.repository.ts", 
    "src\modules\entity-history\repositories\entity-history.repository.ts",
    "src\modules\entities\repositories\individual-entity.repository.ts",
    "src\modules\entities\repositories\organization-entity.repository.ts",
    "src\modules\subscriber-users\repositories\subscriber-user.repository.ts",
    "src\modules\subscribers\repositories\subscriber.repository.ts",
    "src\modules\organization-entity-relationships\repositories\organization-entity-relationship.repository.ts",
    "src\modules\entities\repositories\entity.repository.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PWD $file
    if (Test-Path $fullPath) {
        Write-Host "Processing $file..."
        
        # Read the file content
        $content = Get-Content $fullPath -Raw
        
        # Add IsNull import if not present
        if ($content -notmatch "import.*IsNull.*from.*typeorm") {
            # Find the typeorm import line and add IsNull to it
            $content = $content -replace "(import\s*{[^}]*)(}\s*from\s*['""]typeorm['""])", "`$1, IsNull`$2"
        }
        
        # Replace deleted_at: null with deleted_at: IsNull()
        $content = $content -replace "deleted_at:\s*null(?!\s*as)", "deleted_at: IsNull()"
        
        # Write the content back
        Set-Content $fullPath $content -NoNewline
        Write-Host "Fixed $file"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "All files processed!"