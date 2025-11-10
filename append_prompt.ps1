# PowerShell Script to Append Prompts to PROMPTS.md
# Usage: .\append_prompt.ps1

param(
    [string]$PromptText = "",
    [string]$ResponseText = ""
)

$promptsFile = Join-Path $PSScriptRoot "PROMPTS.md"

# Check if PROMPTS.md exists
if (-not (Test-Path $promptsFile)) {
    Write-Host "Error: PROMPTS.md not found in the current directory!" -ForegroundColor Red
    exit 1
}

# Get current date and time
$currentDate = Get-Date -Format "yyyy-MM-dd"
$currentTime = Get-Date -Format "HH:mm"

# Interactive mode if parameters not provided
if ([string]::IsNullOrWhiteSpace($PromptText)) {
    Write-Host "`n=== Claude AI Prompt Logger ===" -ForegroundColor Cyan
    Write-Host "Enter your prompt (press Enter when done):" -ForegroundColor Yellow
    $PromptText = Read-Host
}

if ([string]::IsNullOrWhiteSpace($ResponseText)) {
    Write-Host "`nEnter Claude's response (press Enter to skip):" -ForegroundColor Yellow
    $ResponseText = Read-Host
}

# Read the current content
$content = Get-Content $promptsFile -Raw

# Find the last prompt number
$promptNumbers = [regex]::Matches($content, "### Prompt (\d+)") | ForEach-Object { [int]$_.Groups[1].Value }
$nextPromptNumber = if ($promptNumbers.Count -gt 0) { ($promptNumbers | Measure-Object -Maximum).Maximum + 1 } else { 1 }

# Check if we need to add a new date section
$dateHeaderExists = $content -match "## $currentDate"

$newEntry = ""

if (-not $dateHeaderExists) {
    # Add new date section before the Format Guide
    $formatGuideIndex = $content.IndexOf("## Format Guide")
    if ($formatGuideIndex -gt 0) {
        $beforeFormatGuide = $content.Substring(0, $formatGuideIndex)
        $formatGuideAndAfter = $content.Substring($formatGuideIndex)

        $newEntry = @"

## $currentDate

### Prompt $nextPromptNumber - [$currentTime]
**User Prompt:**
> $PromptText

**Claude Response:**
> $ResponseText

---

"@

        $newContent = $beforeFormatGuide + $newEntry + $formatGuideAndAfter
    }
} else {
    # Add to existing date section
    # Find the position after the last prompt entry for today
    $pattern = "## $currentDate([\s\S]*?)(?=##|\z)"
    $match = [regex]::Match($content, $pattern)

    if ($match.Success) {
        $dateSection = $match.Value
        $dateSectionStart = $match.Index
        $dateSectionEnd = $dateSectionStart + $dateSection.Length

        $newPromptEntry = @"

### Prompt $nextPromptNumber - [$currentTime]
**User Prompt:**
> $PromptText

**Claude Response:**
> $ResponseText

---
"@

        # Insert before the next ## or at the end of date section
        $insertPosition = $dateSection.LastIndexOf("---")
        if ($insertPosition -gt 0) {
            $insertPosition += 4 # Move past the "---\n"
            $updatedDateSection = $dateSection.Insert($insertPosition, $newPromptEntry)
            $newContent = $content.Substring(0, $dateSectionStart) + $updatedDateSection + $content.Substring($dateSectionEnd)
        }
    }
}

# Update the Last Updated timestamp
$newContent = $newContent -replace "\*\*Last Updated:\*\* \d{4}-\d{2}-\d{2}", "**Last Updated:** $currentDate"

# Write back to file
$newContent | Set-Content $promptsFile -NoNewline

Write-Host "`n✓ Prompt logged successfully!" -ForegroundColor Green
Write-Host "  Prompt #$nextPromptNumber added to PROMPTS.md" -ForegroundColor Gray
Write-Host "  Date: $currentDate at $currentTime`n" -ForegroundColor Gray
