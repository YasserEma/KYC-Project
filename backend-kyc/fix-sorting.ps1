# PowerShell script to fix QueryHelper.applySorting calls
$files = @(
    "src\modules\organization-entity-associations\repositories\organization-entity-association.repository.ts",
    "src\modules\entity-custom-fields\repositories\entity-custom-field.repository.ts",
    "src\modules\individual-entity-relationships\repositories\individual-entity-relationship.repository.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Fixing $file"
        $content = Get-Content $file -Raw
        
        # Fix calls with string alias parameter to use array
        $content = $content -replace "QueryHelper\.applySorting\(queryBuilder, pagination\.sortBy, pagination\.sortOrder, '(\w+)'\)", "QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at'])"
        
        Set-Content $file $content -NoNewline
    }
}

Write-Host "All sorting calls fixed!"