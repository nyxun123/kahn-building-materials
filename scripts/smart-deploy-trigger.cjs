#!/usr/bin/env node

/**
 * 智能部署触发器
 * 可以被其他技能调用，实现自动部署功能
 */

const { AutoDeploySkill } = require('./auto-deploy-skill.cjs');

class SmartDeployTrigger {
  constructor() {
    this.deployer = new AutoDeploySkill();
  }

  // 在任务完成后自动触发部署
  async triggerAfterTask(taskName, taskDescription = '') {
    console.log(`\n🤖 智能部署触发器: 检测到任务 "${taskName}" 完成`);

    if (taskDescription) {
      console.log(`📝 任务描述: ${taskDescription}`);
    }

    // 检查是否有需要部署的变更
    const hasChanges = await this.deployer.detectChanges();

    if (hasChanges) {
      console.log('🚀 检测到重要文件变更，开始自动部署...');

      try {
        const result = await this.deployer.execute();

        if (result.errors.length === 0) {
          console.log('✅ 自动部署成功完成！');
        } else {
          console.log('⚠️  部署过程中遇到问题，请查看详细报告');
        }

        return result;
      } catch (error) {
        console.error('❌ 自动部署失败:', error.message);
        throw error;
      }
    } else {
      console.log('ℹ️  没有检测到需要部署的变更');
      return null;
    }
  }

  // 强制部署（忽略变更检测）
  async forceDeploy(reason = '') {
    console.log(`\n🚀 强制部署模式${reason ? ': ' + reason : ''}`);

    try {
      // 确保有一些变更可以部署
      const result = await this.deployer.execute();
      return result;
    } catch (error) {
      console.error('❌ 强制部署失败:', error.message);
      throw error;
    }
  }
}

// 导出实例，供其他脚本使用
const smartDeploy = new SmartDeployTrigger();

// 简化的导出接口
module.exports = {
  // 在任务完成后调用
  async autoDeployAfterTask(taskName, taskDescription) {
    return await smartDeploy.triggerAfterTask(taskName, taskDescription);
  },

  // 强制部署
  async forceDeploy(reason) {
    return await smartDeploy.forceDeploy(reason);
  },

  // 检查是否需要部署
  async checkDeploymentNeeded() {
    return await smartDeploy.deployer.detectChanges();
  }
};

// 如果直接运行此脚本
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--force')) {
    const reason = args.find(arg => arg.startsWith('--reason='))?.split('=')[1] || '';
    smartDeploy.forceDeploy(reason);
  } else {
    smartDeploy.triggerAfterTask('手动触发', '用户手动执行部署');
  }
}