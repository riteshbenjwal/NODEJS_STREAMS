@echo off
FOR /L %%i IN (1,1,10) DO (
  node -e "process.stdout.write('hello world'.repeat(1e7))" >> big.file
)
