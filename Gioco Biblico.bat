@echo off
start "" "http://localhost:8000/index.html"
start "" /min python -m http.server 8000
exit
