# PowerShell helper to start backend and frontend in new windows
$root = Split-Path -Parent $MyInvocation.MyCommand.Path





Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$root`" && npx.cmd http-server -c-1 -p 8080 `"$root`"" -WindowStyle Normal -NoNewWindow:$false -WorkingDirectory $root
# Start frontend (uses npx.cmd)Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$root\server`" && npm.cmd start" -WindowStyle Normal -NoNewWindow:$false -WorkingDirectory "$root\server"# Start backend (uses npm.cmd to avoid script policy issues)