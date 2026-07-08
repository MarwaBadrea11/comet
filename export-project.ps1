##############################################################
#  export-project.ps1
#  Dumps the full Comet project (structure + file contents)
#  into a single file:  comet-project-export.txt
#
#  Usage (from the repo root):
#    powershell -ExecutionPolicy Bypass -File export-project.ps1
##############################################################

$OutputFile  = Join-Path $PSScriptRoot "comet-project-export.txt"
$ProjectRoot = $PSScriptRoot

# ---- Folders to skip entirely ------------------------------
$SkipDirs = @(
    "node_modules", ".git", "dist", ".next", ".turbo",
    "uploads", "redis-cluster", ".vscode", "public",
    "coverage", "__pycache__", ".pytest_cache"
)

# ---- File extensions to include ----------------------------
$IncludeExtensions = @(
    ".ts", ".tsx", ".js", ".jsx", ".json", ".prisma",
    ".env", ".md", ".css", ".html", ".mjs", ".mts",
    ".yaml", ".yml", ".toml"
)

# ---- Individual filenames / glob patterns to skip ----------
$SkipFiles = @(
    "pnpm-lock.yaml", "package-lock.json", "yarn.lock",
    "*.svg", "*.png", "*.jpg", "*.jpeg", "*.ico",
    "*.woff", "*.woff2", "*.ttf", "*.eot", "*.map",
    "*.pdf"
)

function ShouldSkipFile($name) {
    foreach ($pattern in $SkipFiles) {
        if ($name -like $pattern) { return $true }
    }
    return $false
}

function ShouldIncludeFile($name) {
    # files that start with a dot but have no extension (like .env)
    $ext = [System.IO.Path]::GetExtension($name).ToLower()
    if ($ext -eq "" -and $name.StartsWith(".")) { return $true }
    return $IncludeExtensions -contains $ext
}

# ---- Build a plain ASCII tree ------------------------------
function Get-Tree($dir, $indent = "") {
    $lines = @()
    $items = Get-ChildItem -LiteralPath $dir -Force -ErrorAction SilentlyContinue |
             Sort-Object @{Expression={$_.PSIsContainer}; Descending=$true}, Name

    for ($i = 0; $i -lt $items.Count; $i++) {
        $item        = $items[$i]
        $isLast      = ($i -eq $items.Count - 1)
        $connector   = if ($isLast) { "+-- " } else { "|-- " }
        $childIndent = if ($isLast) { "$indent    " } else { "$indent|   " }

        if ($item.PSIsContainer) {
            if ($SkipDirs -contains $item.Name) {
                $lines += "${indent}${connector}[skipped] $($item.Name)/"
                continue
            }
            $lines += "${indent}${connector}$($item.Name)/"
            $lines += Get-Tree $item.FullName $childIndent
        } else {
            $lines += "${indent}${connector}$($item.Name)"
        }
    }
    return $lines
}

# ---- Collect all source files ------------------------------
function Get-SourceFiles($dir) {
    $results = @()
    $items   = Get-ChildItem -LiteralPath $dir -Force -ErrorAction SilentlyContinue

    foreach ($item in $items) {
        if ($item.PSIsContainer) {
            if ($SkipDirs -contains $item.Name) { continue }
            $results += Get-SourceFiles $item.FullName
        } else {
            if (ShouldSkipFile  $item.Name) { continue }
            if (ShouldIncludeFile $item.Name) { $results += $item.FullName }
        }
    }
    return $results
}

# ---- Write output ------------------------------------------
$writer = [System.IO.StreamWriter]::new($OutputFile, $false, [System.Text.Encoding]::UTF8)

$sep1 = "=" * 70
$sep2 = "-" * 70

$writer.WriteLine($sep1)
$writer.WriteLine("  COMET PROJECT -- FULL EXPORT")
$writer.WriteLine("  Generated : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$writer.WriteLine("  Root      : $ProjectRoot")
$writer.WriteLine($sep1)
$writer.WriteLine("")

# 1. Directory tree
$writer.WriteLine("## PROJECT STRUCTURE")
$writer.WriteLine("")
$treeLines = Get-Tree $ProjectRoot
foreach ($line in $treeLines) { $writer.WriteLine($line) }
$writer.WriteLine("")

# 2. File contents
$writer.WriteLine($sep1)
$writer.WriteLine("## FILE CONTENTS")
$writer.WriteLine($sep1)
$writer.WriteLine("")

$allFiles = Get-SourceFiles $ProjectRoot
$total    = $allFiles.Count
$count    = 0

foreach ($file in $allFiles) {
    $count++
    $relPath = $file.Substring($ProjectRoot.Length).TrimStart('\','/')

    $writer.WriteLine($sep2)
    $writer.WriteLine("FILE ($count/$total): $relPath")
    $writer.WriteLine($sep2)

    try {
        $content = Get-Content -LiteralPath $file -Raw -Encoding UTF8 -ErrorAction Stop
        if ([string]::IsNullOrWhiteSpace($content)) {
            $writer.WriteLine("[empty file]")
        } else {
            $writer.Write($content)
            if (-not $content.EndsWith("`n")) { $writer.WriteLine("") }
        }
    } catch {
        $writer.WriteLine("[could not read file: $($_.Exception.Message)]")
    }

    $writer.WriteLine("")
}

$writer.WriteLine($sep1)
$writer.WriteLine("  END OF EXPORT  |  $total files written")
$writer.WriteLine($sep1)

$writer.Close()

Write-Host ""
Write-Host "Export complete!" -ForegroundColor Green
Write-Host "  Output : $OutputFile"
Write-Host "  Files  : $total"
Write-Host ""
