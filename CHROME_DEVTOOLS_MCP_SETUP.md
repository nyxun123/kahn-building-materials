# Chrome DevTools MCP Setup

## Overview
Chrome DevTools MCP (Model Context Protocol) server has been successfully installed and configured for the Qwen CLI. This MCP allows AI assistants to control and inspect a live Chrome browser for automation, debugging, and performance analysis.

## Installation Summary
- **MCP Server**: Chrome DevTools MCP (version 0.10.1)
- **Repository**: https://github.com/ChromeDevTools/chrome-devtools-mcp
- **Configuration**: Added to `claude_config.json` as `chrome-devtools` server

## Configuration
The MCP server is configured in `/Users/nll/Documents/可以用的网站/claude_config.json`:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

## Capabilities
The Chrome DevTools MCP provides access to:

### Input Automation
- `click` - Click elements on web pages
- `drag` - Drag and drop elements
- `fill` - Fill input fields
- `fill_form` - Fill forms
- `handle_dialog` - Handle browser dialogs
- `hover` - Hover over elements
- `press_key` - Press keyboard keys
- `upload_file` - Upload files

### Navigation Automation
- `close_page` - Close browser pages
- `list_pages` - List open pages
- `navigate_page` - Navigate to URLs
- `new_page` - Create new pages
- `select_page` - Select specific pages
- `wait_for` - Wait for conditions

### Emulation
- `emulate` - Emulate device characteristics
- `resize_page` - Resize browser windows

### Performance
- `performance_analyze_insight` - Analyze performance insights
- `performance_start_trace` - Start performance tracing
- `performance_stop_trace` - Stop performance tracing

### Network
- `get_network_request` - Get network request details
- `list_network_requests` - List network requests

### Debugging
- `evaluate_script` - Execute JavaScript
- `get_console_message` - Get console messages
- `list_console_messages` - List console messages
- `take_screenshot` - Take screenshots
- `take_snapshot` - Take snapshots

## Usage
Once the Qwen CLI connects to the MCP server, you can use prompts like:
- "Check the performance of https://developers.chrome.com"
- "Navigate to https://example.com and fill the search box"
- "Take a screenshot of the current page"
- "Find and click the login button"

## Prerequisites
- Chrome browser is installed (found at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`)
- Node.js (already available in the project)
- The MCP is configured to be enabled in `.claude/settings.local.json`

## Verification
To manually test the MCP server:
```bash
npx -y chrome-devtools-mcp@latest --help
```

The server will automatically start Chrome and provide the configured tools when connected to by an MCP client.