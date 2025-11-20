#!/usr/bin/env node

/**
 * Git自动化脚本
 * 智能Git操作：检查状态、添加文件、提交、推送
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function execCommand(command, description) {
  logInfo(`执行: ${description}`);
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    logSuccess(`${description} 完成`);
    return result.trim();
  } catch (error) {
    logError(`${description} 失败: ${error.message}`);
    throw error;
  }
}

class GitAutomation {
  constructor() {
    this.projectRoot = process.cwd();
    this.excludedFiles = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.DS_Store',
      '*.log'
    ];
  }

  // 检查Git仓库状态
  checkStatus() {
    log('🔍 检查Git仓库状态', colors.cyan);

    try {
      // 检查是否是Git仓库
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
      logSuccess('Git仓库状态正常');

      // 获取当前分支
      const branch = execCommand('git rev-parse --abbrev-ref HEAD', '获取当前分支');
      logInfo(`当前分支: ${branch}`);

      // 获取远程状态
      try {
        const remoteStatus = execSync('git status -sb', { encoding: 'utf8' });
        if (remoteStatus.includes('ahead')) {
          logWarning('本地分支领先远程分支，建议先推送');
        } else if (remoteStatus.includes('behind')) {
          logWarning('本地分支落后远程分支，建议先拉取');
        }
      } catch (e) {
        logWarning('无法获取远程状态');
      }

      return true;
    } catch (error) {
      logError('不是有效的Git仓库');
      return false;
    }
  }

  // 获取修改的文件列表
  getChangedFiles() {
    log('📝 获取修改的文件列表', colors.cyan);

    try {
      const output = execSync('git status --porcelain', { encoding: 'utf8' });
      const files = output.trim().split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [status, ...pathParts] = line.split(/\s+/);
          const filepath = pathParts.join(' ');
          const statusIcon = this.getStatusIcon(status);
          return { status, filepath, statusIcon };
        });

      if (files.length === 0 || (files.length === 1 && files[0].filepath === '')) {
        logInfo('没有修改的文件');
        return [];
      }

      logInfo(`发现 ${files.length} 个修改的文件:`);
      files.forEach(file => {
        const displayStatus = this.getStatusDescription(file.status);
        log(`   ${file.statusIcon} ${file.filepath} (${displayStatus})`, colors.yellow);
      });

      return files;
    } catch (error) {
      logError('获取修改文件失败');
      return [];
    }
  }

  // 获取状态图标
  getStatusIcon(status) {
    if (status.includes('M')) return '📝'; // 修改
    if (status.includes('A')) return '➕'; // 新增
    if (status.includes('D')) return '🗑️'; // 删除
    if (status.includes('R')) return '🔄'; // 重命名
    if (status.includes('C')) return '📋'; // 复制
    if (status.includes('??')) return '❓'; // 未跟踪
    if (status.includes('!!')) return '🚫'; // 忽略
    return '❓';
  }

  // 获取状态描述
  getStatusDescription(status) {
    if (status.includes('M')) return '修改';
    if (status.includes('A')) return '新增';
    if (status.includes('D')) return '删除';
    if (status.includes('R')) return '重命名';
    if (status.includes('C')) return '复制';
    if (status.includes('??')) return '未跟踪';
    if (status.includes('!!')) return '忽略';
    return '未知';
  }

  // 智能添加文件
  smartAdd(files = null) {
    log('🔧 智能添加文件', colors.cyan);

    if (files && files.length > 0) {
      // 添加指定文件
      files.forEach(file => {
        try {
          execCommand(`git add "${file.filepath}"`, `添加 ${file.filepath}`);
        } catch (error) {
          logError(`添加 ${file.filepath} 失败`);
        }
      });
    } else {
      // 添加所有修改的文件
      logInfo('添加所有修改的文件...');
      try {
        execCommand('git add -A', '添加所有文件');
        logSuccess('文件添加完成');
      } catch (error) {
        logError('添加文件失败');
        throw error;
      }
    }

    // 验证暂存区
    try {
      const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      if (stagedFiles.trim()) {
        const count = stagedFiles.trim().split('\n').length;
        logSuccess(`已暂存 ${count} 个文件`);
      } else {
        logWarning('暂存区为空');
      }
    } catch (error) {
      logWarning('无法验证暂存区');
    }
  }

  // 生成智能提交信息
  generateCommitMessage(customMessage = null) {
    const files = this.getChangedFiles();
    const timestamp = new Date().toLocaleString('zh-CN');

    if (customMessage) {
      return `${customMessage} | Time: ${timestamp}`;
    }

    // 根据修改的文件类型生成提交信息
    const fileTypes = {};
    files.forEach(file => {
      const ext = path.extname(file.filepath);
      const dir = path.dirname(file.filepath);

      if (ext) {
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      } else if (dir) {
        fileTypes[dir] = (fileTypes[dir] || 0) + 1;
      }
    });

    let commitType = 'update';
    let message = '';

    // 分析文件类型确定提交类型
    if (fileTypes['.tsx'] || fileTypes['.ts'] || fileTypes['.js'] || fileTypes['.jsx']) {
      commitType = 'code';
      message += '代码更新';
    } else if (fileTypes['.css'] || fileTypes['.scss'] || fileTypes['.less']) {
      commitType = 'style';
      message += '样式更新';
    } else if (fileTypes['.json']) {
      commitType = 'config';
      message += '配置更新';
    } else if (fileTypes['.md'] || fileTypes['.txt']) {
      commitType = 'docs';
      message += '文档更新';
    } else if (fileTypes['src/'] || fileTypes['src']) {
      commitType = 'feature';
      message += '功能更新';
    } else if (fileTypes['public/'] || fileTypes['public']) {
      commitType = 'asset';
      message += '资源更新';
    } else {
      message += '文件更新';
    }

    // 添加文件数量信息
    const totalFiles = files.length;
    message += ` (${totalFiles}个文件)`;

    // 添加具体的文件信息
    if (totalFiles <= 3) {
      const fileNames = files.map(f => path.basename(f.filepath)).join(', ');
      message += `: ${fileNames}`;
    }

    return `${message} | Time: ${timestamp}`;
  }

  // 提交更改
  commit(commitMessage = null) {
    log('💾 提交更改', colors.cyan);

    try {
      // 生成提交信息
      const fullCommitMessage = this.generateCommitMessage(commitMessage);
      logInfo(`提交信息: ${fullCommitMessage}`);

      // 执行提交
      execCommand(`git commit -m "${fullCommitMessage}"`, '提交更改');
      logSuccess('提交成功');

      return fullCommitMessage;
    } catch (error) {
      logError('提交失败');
      throw error;
    }
  }

  // 推送到远程
  push(branch = 'main') {
    log('🚀 推送到远程仓库', colors.cyan);

    try {
      // 检查是否有远程仓库
      const remotes = execSync('git remote', { encoding: 'utf8' });
      if (!remotes.trim()) {
        logWarning('没有配置远程仓库');
        return false;
      }

      // 推送
      execCommand(`git push origin ${branch}`, `推送到 ${branch} 分支`);
      logSuccess('推送成功');

      return true;
    } catch (error) {
      logError('推送失败');
      throw error;
    }
  }

  // 拉取远程更新
  pull(branch = 'main') {
    log('📥 拉取远程更新', colors.cyan);

    try {
      execCommand(`git pull origin ${branch}`, `拉取 ${branch} 分支更新`);
      logSuccess('拉取成功');
      return true;
    } catch (error) {
      logError('拉取失败');
      logWarning('可能存在冲突，请手动解决');
      return false;
    }
  }

  // 获取提交历史
  getCommitHistory(count = 5) {
    log('📚 获取提交历史', colors.cyan);

    try {
      const history = execCommand(`git log --oneline -${count}`, '获取提交历史');
      const commits = history.split('\n').filter(line => line.trim());

      logInfo(`最近 ${commits.length} 次提交:`);
      commits.forEach((commit, index) => {
        log(`   ${index + 1}. ${commit}`, colors.yellow);
      });

      return commits;
    } catch (error) {
      logError('获取提交历史失败');
      return [];
    }
  }

  // 一键部署流程
  async autoDeploy(commitMessage = null, push = true) {
    log('🚀 开始自动部署流程', colors.bright);

    try {
      // 1. 检查状态
      if (!this.checkStatus()) {
        throw new Error('Git仓库状态异常');
      }

      // 2. 获取修改的文件
      const files = this.getChangedFiles();
      if (files.length === 0) {
        logInfo('没有需要部署的更改');
        return true;
      }

      // 3. 添加文件
      this.smartAdd(files);

      // 4. 提交
      const fullCommitMessage = this.commit(commitMessage);

      // 5. 推送（如果需要）
      if (push) {
        await this.push();
      }

      logSuccess('自动部署完成！');
      return true;

    } catch (error) {
      logError(`自动部署失败: ${error.message}`);
      return false;
    }
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';
  const git = new GitAutomation();

  try {
    switch (command) {
      case 'status':
        git.checkStatus();
        git.getChangedFiles();
        break;

      case 'add':
        git.smartAdd();
        break;

      case 'commit':
        const commitMsg = args[1] || null;
        git.commit(commitMsg);
        break;

      case 'push':
        const branch = args[1] || 'main';
        await git.push(branch);
        break;

      case 'pull':
        const pullBranch = args[1] || 'main';
        await git.pull(pullBranch);
        break;

      case 'auto':
        const autoCommitMsg = args[1] || null;
        const shouldPush = !args.includes('--no-push');
        await git.autoDeploy(autoCommitMsg, shouldPush);
        break;

      case 'history':
        const count = parseInt(args[1]) || 5;
        git.getCommitHistory(count);
        break;

      default:
        log('Git自动化脚本使用说明:', colors.bright);
        log('  node scripts/git-automation.js status     - 检查Git状态', colors.blue);
        log('  node scripts/git-automation.js add        - 添加修改的文件', colors.blue);
        log('  node scripts/git-automation.js commit [msg] - 提交更改', colors.blue);
        log('  node scripts/git-automation.js push [branch] - 推送到远程', colors.blue);
        log('  node scripts/git-automation.js pull [branch] - 拉取远程更新', colors.blue);
        log('  node scripts/git-automation.js auto [msg] --no-push - 自动部署', colors.blue);
        log('  node scripts/git-automation.js history [count] - 查看提交历史', colors.blue);
        break;
    }
  } catch (error) {
    logError(`执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 导出类供其他模块使用
exports.GitAutomation = GitAutomation;

// 如果直接运行此脚本
if (typeof require !== 'undefined' && require.main === module) {
  main();
}