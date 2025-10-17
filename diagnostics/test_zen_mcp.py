#!/usr/bin/env python3
import json
import subprocess
import sys
import os

def test_zen_mcp():
    """Test Zen MCP server connectivity"""
    
    # Set environment variables
    env = os.environ.copy()
    env['GEMINI_API_KEY'] = 'AIzaSyBeo4LFnt4LgZCwMoWtGaxiXNZL_AtY8xo'
    env['DEFAULT_MODEL'] = 'auto'
    env['LOG_LEVEL'] = 'INFO'
    env['DISABLED_TOOLS'] = 'analyze,refactor,testgen,secaudit,docgen,tracer'
    env['ZEN_MCP_FORCE_ENV_OVERRIDE'] = 'true'
    
    # Zen MCP server command
    cmd = [
        '/Users/nll/Documents/zen mcp/.zen-mcp-server/.zen_venv/bin/python',
        '/Users/nll/Documents/zen mcp/.zen-mcp-server/server.py'
    ]
    
    try:
        # Start the server process
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            env=env,
            cwd='/Users/nll/Documents/zen mcp/.zen-mcp-server'
        )
        
        # Send JSON-RPC request to list tools
        request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/list",
            "params": {}
        }
        
        stdout, stderr = process.communicate(
            input=json.dumps(request) + '\n',
            timeout=10
        )
        
        print("=== STDOUT ===")
        print(stdout[:500])
        print("\n=== STDERR ===")
        print(stderr[:500])
        print(f"\n=== Return Code: {process.returncode} ===")
        
        return process.returncode == 0
        
    except subprocess.TimeoutExpired:
        process.kill()
        print("Process timed out")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = test_zen_mcp()
    print(f"\nTest {'PASSED' if success else 'FAILED'}")
