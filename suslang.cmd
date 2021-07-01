@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\suslang.js" %*
) ELSE (
  node  "%~dp0\suslang.js" %*
)