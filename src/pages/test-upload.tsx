import { useState } from 'react';
import { getApiUrl, API_CONFIG } from '@/lib/config';

const TestUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setResult(null);

    try {
      console.log('🚀 开始测试上传:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'test');

      console.log('📡 发送请求到:', getApiUrl(API_CONFIG.PATHS.UPLOAD_IMAGE));

      const response = await fetch(getApiUrl(API_CONFIG.PATHS.UPLOAD_IMAGE), {
        method: 'POST',
        body: formData,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      console.log('📨 响应状态:', response.status, response.statusText);
      console.log('📨 响应头:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('📨 响应原始内容:', responseText);

      let responseJson;
      try {
        responseJson = JSON.parse(responseText);
        console.log('📨 响应JSON:', responseJson);
      } catch (parseError) {
        console.error('❌ JSON解析失败:', parseError);
        throw new Error(`无法解析响应: ${responseText}`);
      }

      if (response.ok && responseJson.code === 200) {
        setResult(responseJson);
        console.log('✅ 上传成功!');
      } else {
        throw new Error(`上传失败: ${responseJson.message || '未知错误'}`);
      }

    } catch (error) {
      console.error('❌ 上传错误:', error);
      setError(error instanceof Error ? error.message : '上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>图片上传测试页面</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload}
          disabled={uploading}
        />
        {uploading && <span style={{ marginLeft: '10px' }}>上传中...</span>}
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          border: '1px solid #f44336', 
          borderRadius: '4px',
          marginBottom: '20px' 
        }}>
          <strong>错误:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#e8f5e8', 
          border: '1px solid #4caf50', 
          borderRadius: '4px',
          marginBottom: '20px' 
        }}>
          <strong>上传成功!</strong>
          <pre style={{ marginTop: '10px', fontSize: '12px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>请打开浏览器控制台查看详细的调试信息</p>
        <p>测试步骤：</p>
        <ol>
          <li>选择一张图片文件</li>
          <li>查看控制台的详细日志</li>
          <li>如果失败，复制错误信息</li>
        </ol>
      </div>
    </div>
  );
};

export default TestUpload;