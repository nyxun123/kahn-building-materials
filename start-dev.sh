#!/bin/bash

# 启动Wrangler Pages开发服务器（包含Workers函数）
echo "🚀 启动Cloudflare Pages开发服务器..."
wrangler pages dev dist --port 8788 --binding DB=kaneshuju --d1 DB=1017f91b-e6f1-42d9-b9c3-5f32904be73a --r2 IMAGE_BUCKET=kaen &
WRANGLER_PID=$!

# 等待Wrangler启动
sleep 3

# 启动Vite开发服务器
echo "🚀 启动Vite开发服务器..."
pnpm dev &
VITE_PID=$!

# 捕获退出信号，清理进程
trap "kill $WRANGLER_PID $VITE_PID 2>/dev/null" EXIT

# 等待任一进程退出
wait

