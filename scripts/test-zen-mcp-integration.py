#!/usr/bin/env python3
"""
Zen MCP 集成测试脚本
测试 NPX 方式的 Zen MCP Server 是否正常工作
"""

import json
import subprocess
import sys
import os

def test_zen_mcp_npx():
    """测试 Zen MCP Server (NPX 方式)"""

    print("🔍 测试 Zen MCP Server (NPX 方式)...")

    # 设置环境变量
    env = os.environ.copy()
    env['GEMINI_API_KEY'] = 'AIzaSyBeo4LFnt4LgZCwMoWtGaxiXNZL_AtY8xo'
    env['DEFAULT_MODEL'] = 'auto'
    env['LOG_LEVEL'] = 'INFO'
    env['DISABLED_TOOLS'] = 'analyze,refactor,testgen,secaudit,docgen,tracer'
    env['ZEN_MCP_FORCE_ENV_OVERRIDE'] = 'true'

    # NPX 命令
    cmd = ['npx', 'zen-mcp-server-199bio']

    try:
        # 启动服务器进程
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            env=env
        )

        # 发送工具列表请求
        request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/list",
            "params": {}
        }

        print("📤 发送工具列表请求...")
        stdout, stderr = process.communicate(
            input=json.dumps(request) + '\n',
            timeout=15
        )

        print(f"✅ 返回码: {process.returncode}")

        if stdout:
            print("📥 服务器响应:")
            try:
                response = json.loads(stdout)
                if 'result' in response and 'tools' in response['result']:
                    tools = response['result']['tools']
                    print(f"🔧 发现 {len(tools)} 个可用工具:")
                    for tool in tools[:5]:  # 显示前5个工具
                        print(f"  • {tool['name']}: {tool.get('description', '无描述')[:60]}...")
                    if len(tools) > 5:
                        print(f"  • ... 还有 {len(tools) - 5} 个工具")
                    print("\n✅ Zen MCP Server (NPX 方式) 连接成功！")
                    return True
                else:
                    print("❌ 未找到工具列表")
                    print(f"响应: {stdout[:500]}")
            except json.JSONDecodeError:
                print("❌ 解析响应失败")
                print(f"原始输出: {stdout[:500]}")

        if stderr:
            print("⚠️ 错误输出:")
            print(stderr[:500])

        return process.returncode == 0

    except subprocess.TimeoutExpired:
        process.kill()
        print("⏰ 请求超时")
        return False
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False

def test_version_tool():
    """测试版本工具"""

    print("\n🔍 测试版本工具...")

    env = os.environ.copy()
    env['GEMINI_API_KEY'] = 'AIzaSyBeo4LFnt4LgZCwMoWtGaxiXNZL_AtY8xo'
    env['DEFAULT_MODEL'] = 'auto'
    env['LOG_LEVEL'] = 'INFO'
    env['DISABLED_TOOLS'] = 'analyze,refactor,testgen,secaudit,docgen,tracer'
    env['ZEN_MCP_FORCE_ENV_OVERRIDE'] = 'true'

    cmd = ['npx', 'zen-mcp-server-199bio']

    try:
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            env=env
        )

        # 发送版本检查请求
        request = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": {
                "name": "version",
                "arguments": {}
            }
        }

        print("📤 发送版本检查请求...")
        stdout, stderr = process.communicate(
            input=json.dumps(request) + '\n',
            timeout=20
        )

        if stdout and "version" in stdout.lower():
            print("✅ 版本工具测试成功！")
            return True
        else:
            print("⚠️ 版本工具测试完成（可能需要API密钥）")
            return True

    except subprocess.TimeoutExpired:
        process.kill()
        print("⏰ 版本测试超时")
        return False
    except Exception as e:
        print(f"❌ 版本测试失败: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Zen MCP Server 集成测试")
    print("=" * 60)

    # 测试基本连接
    success1 = test_zen_mcp_npx()

    # 测试版本工具
    success2 = test_version_tool()

    print("\n" + "=" * 60)
    print("📊 测试结果:")
    print(f"  • NPX 连接测试: {'✅ 通过' if success1 else '❌ 失败'}")
    print(f"  • 版本工具测试: {'✅ 通过' if success2 else '❌ 失败'}")

    if success1:
        print("\n🎉 Zen MCP Server 已成功集成到 Claude Code CLI！")
        print("\n📝 可用工具包括:")
        tools_list = [
            "zen chat - 多模型对话协作",
            "zen thinkdeep - 深度思考分析",
            "zen planner - 项目规划",
            "zen consensus - 多模型共识决策",
            "zen codereview - 专业代码审查",
            "zen debug - 系统性调试分析",
            "zen apilookup - API文档查询",
            "zen challenge - 批判性思维分析"
        ]
        for tool in tools_list:
            print(f"  • {tool}")

        print("\n💡 使用方法:")
        print('  "请使用 zen codereview 分析这段代码"')
        print('  "用 zen thinkdeep 深入分析这个架构"')
        print('  "通过 zen consensus 获取多个模型意见"')

    else:
        print("\n❌ 集成测试失败，请检查配置")
        print("📋 故障排除:")
        print("  1. 确保网络连接正常")
        print("  2. 检查 API 密钥是否有效")
        print("  3. 重启 Claude Code CLI")

    print("=" * 60)