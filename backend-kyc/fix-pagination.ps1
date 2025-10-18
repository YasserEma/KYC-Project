# PowerShell script to fix QueryHelper.applyPagination calls
$files = @(
    "src\modules\risk-configuration\repositories\risk-configuration.repository.ts",
    "src\modules\risk-analysis\repositories\risk-analysis.repository.ts",
    "src\modules\individual-entity-relationships\repositories\individual-entity-relationship.repository.ts",
    "src\modules\lists-management\repositories\list.repository.ts",
    "src\modules\lists-management\repositories\list-value.repository.ts",
    "src\modules\organization-entity-associations\repositories\organization-entity-association.repository.ts",
    "src\modules\entity-custom-fields\repositories\entity-custom-field.repository.ts",
    "src\modules\documents\repositories\document.repository.ts",
    "src\modules\screening-analysis\repositories\screening-analysis.repository.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Fixing $file"
        $content = Get-Content $file -Raw
        $content = $content -replace "return QueryHelper\.applyPagination\(", "return QueryHelper.buildPaginationResult("
        Set-Content $file $content -NoNewline
    }
}

Write-Host "All files fixed!"