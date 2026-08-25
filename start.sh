#!/bin/bash

# ====================================================================
# AgriShield (کسان دوست) — One-Click Fullstack Launch Script
# ====================================================================

# Resolve root directory as an absolute path
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🌾 Starting AgriShield (کسان دوست)..."
echo "📂 Project Root: $ROOT_DIR"

cleanup() {
    echo -e "\n🛑 Stopping AgriShield services..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Start Python FastAPI Backend
echo "🚀 [1/2] Starting Python FastAPI Backend on http://localhost:8000..."
cd "$ROOT_DIR/backend"
if [ -d "$ROOT_DIR/backend/venv" ]; then
    source "$ROOT_DIR/backend/venv/bin/activate"
fi
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait 2 seconds for backend initialization
sleep 2

# 2. Start Next.js Frontend
echo "🌐 [2/2] Starting Next.js Web App on http://localhost:3000..."
cd "$ROOT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "============================================================"
echo "🎉 AgriShield is running!"
echo "👉 Open Web App: http://localhost:3000"
echo "👉 API Swagger Docs: http://localhost:8000/docs"
echo "👉 Press Ctrl+C in this terminal to stop both servers."
echo "============================================================"
echo ""

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
