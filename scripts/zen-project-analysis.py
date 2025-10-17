#!/usr/bin/env python3
"""
使用 Zen MCP 工具对当前项目进行多模态分析
"""

import json
import subprocess
import sys
import os
import time

def run_zen_tool(tool_name, arguments, timeout=30):
    """运行 Zen MCP 工具"""

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

        # 构建请求
        request = {
            "jsonrpc": "2.0",
            "id": int(time.time()),
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments
            }
        }

        print(f"🔧 调用 Zen {tool_name} 工具...")

        # 发送请求
        stdout, stderr = process.communicate(
            input=json.dumps(request) + '\n',
            timeout=timeout
        )

        if process.returncode == 0 and stdout:
            try:
                response = json.loads(stdout)
                if 'result' in response:
                    return response['result'], None
                elif 'error' in response:
                    return None, response['error']
                else:
                    return stdout, None
            except json.JSONDecodeError:
                return stdout, None
        else:
            return None, stderr if stderr else f"Process failed with code {process.returncode}"

    except subprocess.TimeoutExpired:
        process.kill()
        return None, "请求超时"
    except Exception as e:
        return None, str(e)

def main():
    """主分析流程"""

    print("=" * 80)
    print("🚀 Zen MCP 多模态项目分析")
    print("=" * 80)
    print(f"📁 分析项目: /Users/nll/Documents/可以用的网站")
    print(f"🕐 分析时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)

    project_dir = "/Users/nll/Documents/可以用的网站"
    analysis_results = {}

    # 1. 版本检查
    print("\n1️⃣ 检查 Zen MCP 版本...")
    result, error = run_zen_tool("version", {}, timeout=15)
    if error:
        print(f"❌ 版本检查失败: {error}")
    else:
        print("✅ Zen MCP 版本检查完成")
        analysis_results['version'] = result

    # 2. 项目整体分析 (chat)
    print("\n2️⃣ 项目整体分析...")
    chat_prompt = f"""
    请对当前项目进行全面分析。

    项目路径: {project_dir}
    项目类型: 多语言企业网站

    请分析以下方面:
    1. 项目整体架构和技术栈
    2. 代码组织结构
    3. 技术选型的合理性
    4. 项目的优势和特色

    请提供简洁但全面的分析报告。
    """

    result, error = run_zen_tool("chat", {
        "prompt": chat_prompt,
        "working_directory": project_dir
    }, timeout=60)

    if error:
        print(f"❌ 项目分析失败: {error}")
    else:
        print("✅ 项目整体分析完成")
        analysis_results['chat'] = result

    # 3. 深度思考分析 (thinkdeep)
    print("\n3️⃣ 深度架构分析...")
    thinkdeep_prompt = f"""
    请深入分析当前项目的架构设计和技术实现。

    分析重点:
    1. React + TypeScript 架构的优缺点
    2. Cloudflare 无服务器架构的合理性
    3. 多语言国际化实现的技术方案
    4. 数据库设计 (D1 + R2) 的合理性
    5. 性能优化和可扩展性考虑

    请提供深入的技术洞察和改进建议。
    """

    result, error = run_zen_tool("thinkdeep", {
        "prompt": thinkdeep_prompt,
        "working_directory": project_dir
    }, timeout=90)

    if error:
        print(f"❌ 深度分析失败: {error}")
    else:
        print("✅ 深度架构分析完成")
        analysis_results['thinkdeep'] = result

    # 4. 代码质量审查 (codereview)
    print("\n4️⃣ 代码质量审查...")
    result, error = run_zen_tool("codereview", {
        "target": project_dir,
        "focus": "architecture,performance,security,maintainability",
        "depth": "comprehensive"
    }, timeout=60)

    if error:
        print(f"❌ 代码审查失败: {error}")
    else:
        print("✅ 代码质量审查完成")
        analysis_results['codereview'] = result

    # 5. 项目规划建议 (planner)
    print("\n5️⃣ 优化规划建议...")
    planner_prompt = f"""
    基于对当前项目的分析，请制定一个详细的优化和改进计划。

    项目现状: 多语言企业网站，React + TypeScript + Cloudflare

    请制定:
    1. 短期优化目标 (1-2个月)
    2. 中期改进计划 (3-6个月)
    3. 长期发展规划 (6个月以上)
    4. 优先级排序和实施步骤
    5. 资源需求评估

    请提供具体可执行的计划。
    """

    result, error = run_zen_tool("planner", {
        "prompt": planner_prompt,
        "working_directory": project_dir,
        "scope": "comprehensive"
    }, timeout=90)

    if error:
        print(f"❌ 规划分析失败: {error}")
    else:
        print("✅ 优化规划建议完成")
        analysis_results['planner'] = result

    # 生成分析报告
    print("\n" + "=" * 80)
    print("📊 Zen MCP 多模态分析报告")
    print("=" * 80)

    for tool, result in analysis_results.items():
        print(f"\n🔧 {tool.upper()} 工具分析结果:")
        print("-" * 40)
        if isinstance(result, dict):
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(result)
        print()

    # 保存分析报告
    report_file = f"{project_dir}/zen-analysis-report-{int(time.time())}.json"
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(analysis_results, f, indent=2, ensure_ascii=False)

    print(f"📄 详细分析报告已保存至: {report_file}")
    print("=" * 80)
    print("🎉 Zen MCP 多模态分析完成！")

if __name__ == "__main__":
    main()