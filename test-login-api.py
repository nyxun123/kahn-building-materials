#!/usr/bin/env python3
"""测试登录 API 是否返回 JWT tokens"""

import json
import urllib.request
import urllib.error
from datetime import datetime

def test_login_api():
    print("=" * 60)
    print("  Cloudflare Pages 部署测试")
    print("=" * 60)
    print()
    print(f"🕐 测试时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    print("-" * 60)
    print("🔍 测试登录 API...")
    print("📍 URL: https://kn-wallpaperglue.com/api/admin/login")
    print()
    
    # 准备请求数据
    data = {
        "email": "admin@kn-wallpaperglue.com",
        "password": "admin123"
    }
    
    json_data = json.dumps(data).encode('utf-8')
    
    # 创建请求
    req = urllib.request.Request(
        'https://kn-wallpaperglue.com/api/admin/login',
        data=json_data,
        headers={
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        },
        method='POST'
    )
    
    try:
        # 发送请求
        with urllib.request.urlopen(req, timeout=30) as response:
            status_code = response.status
            response_data = json.loads(response.read().decode('utf-8'))
            
            print(f"📊 响应状态码: {status_code}")
            print()
            print("📦 响应数据:")
            print(json.dumps(response_data, indent=2, ensure_ascii=False))
            print()
            
            # 验证响应
            if status_code == 200 and response_data.get('success'):
                print("✅ 登录成功！")
                print()
                
                # 检查关键字段
                checks = {
                    'accessToken': bool(response_data.get('accessToken')),
                    'refreshToken': bool(response_data.get('refreshToken')),
                    'authType': response_data.get('authType') == 'JWT',
                    'user': bool(response_data.get('user')),
                    'expiresIn': bool(response_data.get('expiresIn'))
                }
                
                print("🔍 字段检查:")
                for field, passed in checks.items():
                    status = '✅' if passed else '❌'
                    value = response_data.get(field)
                    
                    if field in ['accessToken', 'refreshToken'] and value:
                        display_value = value[:20] + '...'
                    else:
                        display_value = value
                    
                    print(f"  {status} {field}: {display_value}")
                
                print()
                
                # 判断部署是否成功
                if all(checks.values()):
                    print("🎉 部署成功！所有字段都正确返回！")
                    print()
                    print("✅ JWT 认证已启用")
                    print("✅ Access Token 已返回")
                    print("✅ Refresh Token 已返回")
                    print()
                    print("-" * 60)
                    print()
                    print("📋 测试总结:")
                    print("  登录 API: ✅ 通过")
                    print()
                    print("🎉 所有测试通过！部署成功！")
                    print()
                    print("✅ 你现在可以访问网站并登录了")
                    print("🌐 网站地址: https://kn-wallpaperglue.com")
                    print()
                    return True
                else:
                    print("⚠️  部署可能未完成或配置有误")
                    print()
                    print("缺失的字段:")
                    for field, passed in checks.items():
                        if not passed:
                            print(f"  ❌ {field}")
                    print()
                    return False
            else:
                print("❌ 登录失败！")
                print(f"状态码: {status_code}")
                print(f"响应: {response_data}")
                print()
                return False
                
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP 错误: {e.code}")
        try:
            error_data = json.loads(e.read().decode('utf-8'))
            print(f"错误响应: {json.dumps(error_data, indent=2, ensure_ascii=False)}")
        except:
            print(f"错误信息: {e.reason}")
        print()
        return False
        
    except urllib.error.URLError as e:
        print(f"❌ 网络错误: {e.reason}")
        print()
        return False
        
    except Exception as e:
        print(f"❌ 未知错误: {str(e)}")
        print()
        return False

if __name__ == '__main__':
    success = test_login_api()
    
    if not success:
        print("💡 建议:")
        print("  1. 等待 2-3 分钟后重新运行测试")
        print("  2. 检查 Cloudflare Pages 部署状态")
        print("  3. 清除浏览器缓存后访问网站")
        print()
        exit(1)
    else:
        exit(0)

