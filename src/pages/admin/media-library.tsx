import { useState } from "react";
import {
  Card,
  Flex,
  Text,
  Button,
  Title,
  Badge,
  Select,
  SelectItem,
  Grid,
  TextInput,
  Textarea,
} from "@tremor/react";
import { useList, useCreate, useUpdate, useDelete, BaseKey } from "@refinedev/core";
import type { CrudOperators } from "@refinedev/core";
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Edit,
  X,
  Filter,
  Search
} from "lucide-react";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";
import VideoUpload from "@/components/VideoUpload";

interface MediaFile {
  id: number;
  file_name: string;
  file_url: string;
  file_type: 'image' | 'video';
  file_size: number;
  mime_type: string;
  folder: string;
  title_zh?: string;
  title_en?: string;
  title_ru?: string;
  description_zh?: string;
  description_en?: string;
  description_ru?: string;
  usage_location?: string;
  created_at: string;
}

export default function MediaLibrary() {
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [editingMedia, setEditingMedia] = useState<MediaFile | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  // 获取媒体文件列表
  const { data, refetch, isLoading } = useList<MediaFile>({
    resource: "media",
    pagination: {
      pageSize: 50,
    },
    filters: [
      ...(fileTypeFilter !== "all" ? [{ field: "file_type", operator: "eq" as const, value: fileTypeFilter }] : []),
      ...(folderFilter !== "all" ? [{ field: "folder", operator: "eq" as const, value: folderFilter }] : []),
    ],
  });

  const { mutate: createMedia } = useCreate();
  const { mutate: updateMedia } = useUpdate();
  const { mutate: deleteMedia } = useDelete();

  const mediaFiles = data?.data || [];

  // 过滤搜索
  const filteredMedia = mediaFiles.filter(media => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      media.file_name.toLowerCase().includes(query) ||
      media.title_zh?.toLowerCase().includes(query) ||
      media.title_en?.toLowerCase().includes(query) ||
      media.description_zh?.toLowerCase().includes(query)
    );
  });

  // 处理文件上传完成
  const handleFileUploaded = (url: string) => {
    setUploadedFileUrl(url);
  };

  // 保存媒体文件记录
  const handleSaveMedia = () => {
    if (!uploadedFileUrl) {
      toast.error('请先上传文件');
      return;
    }

    const fileName = uploadedFileUrl.split('/').pop() || 'unknown';
    const fileType = uploadType;
    const mimeType = uploadType === 'image' ? 'image/jpeg' : 'video/mp4';

    createMedia({
      resource: "media",
      values: {
        file_name: fileName,
        file_url: uploadedFileUrl,
        file_type: fileType,
        file_size: 0,
        mime_type: mimeType,
        folder: folderFilter !== 'all' ? folderFilter : 'general',
      },
    }, {
      onSuccess: () => {
        toast.success('媒体文件保存成功');
        setShowUploadDialog(false);
        setUploadedFileUrl('');
        refetch();
      },
      onError: (error: any) => {
        console.error('保存媒体文件失败:', error);
        const errorMessage = error?.message || error?.error || error?.toString() || '保存失败';
        toast.error(`保存失败: ${errorMessage}`);
      },
    });
  };

  // 删除媒体文件
  const handleDelete = (id: number) => {
    if (!confirm('确定要删除这个文件吗？')) return;

    deleteMedia({
      resource: "media",
      id,
    }, {
      onSuccess: () => {
        toast.success('文件删除成功');
        refetch();
      },
      onError: (error) => {
        toast.error(`删除失败: ${error.message}`);
      },
    });
  };

  // 更新媒体文件元数据
  const handleUpdateMetadata = () => {
    if (!editingMedia) return;

    updateMedia({
      resource: "media",
      id: editingMedia.id,
      values: {
        title_zh: editingMedia.title_zh,
        title_en: editingMedia.title_en,
        title_ru: editingMedia.title_ru,
        description_zh: editingMedia.description_zh,
        description_en: editingMedia.description_en,
        description_ru: editingMedia.description_ru,
        usage_location: editingMedia.usage_location,
      },
    }, {
      onSuccess: () => {
        toast.success('元数据更新成功');
        setEditingMedia(null);
        refetch();
      },
      onError: (error) => {
        toast.error(`更新失败: ${error.message}`);
      },
    });
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '未知';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <Title className="text-2xl font-bold text-slate-900">媒体库</Title>
        <Text className="text-slate-500">管理网站的图片和视频文件</Text>
      </div>

      {/* 操作栏 */}
      <Card>
        <Flex justifyContent="between" alignItems="center" className="gap-4">
          <Flex alignItems="center" className="gap-3 flex-1">
            {/* 搜索 */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <TextInput
                placeholder="搜索文件名、标题、描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 文件类型筛选 */}
            <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
              <SelectItem value="all">所有类型</SelectItem>
              <SelectItem value="image">图片</SelectItem>
              <SelectItem value="video">视频</SelectItem>
            </Select>

            {/* 文件夹筛选 */}
            <Select value={folderFilter} onValueChange={setFolderFilter}>
              <SelectItem value="all">所有文件夹</SelectItem>
              <SelectItem value="home">首页</SelectItem>
              <SelectItem value="oem">OEM</SelectItem>
              <SelectItem value="products">产品</SelectItem>
              <SelectItem value="general">通用</SelectItem>
            </Select>
          </Flex>

          {/* 上传按钮 */}
          <Flex className="gap-2">
            <Button
              icon={ImageIcon}
              onClick={() => {
                setUploadType('image');
                setShowUploadDialog(true);
              }}
            >
              上传图片
            </Button>
            <Button
              icon={Video}
              onClick={() => {
                setUploadType('video');
                setShowUploadDialog(true);
              }}
            >
              上传视频
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* 统计信息 */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4">
        <Card>
          <Text>总文件数</Text>
          <Title className="text-2xl">{mediaFiles.length}</Title>
        </Card>
        <Card>
          <Text>图片</Text>
          <Title className="text-2xl">
            {mediaFiles.filter(m => m.file_type === 'image').length}
          </Title>
        </Card>
        <Card>
          <Text>视频</Text>
          <Title className="text-2xl">
            {mediaFiles.filter(m => m.file_type === 'video').length}
          </Title>
        </Card>
        <Card>
          <Text>搜索结果</Text>
          <Title className="text-2xl">{filteredMedia.length}</Title>
        </Card>
      </Grid>

      {/* 媒体文件网格 */}
      <Card>
        {isLoading ? (
          <div className="text-center py-12">
            <Text>加载中...</Text>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <Text>暂无媒体文件</Text>
          </div>
        ) : (
          <Grid numItems={2} numItemsSm={3} numItemsLg={4} className="gap-4">
            {filteredMedia.map((media) => (
              <Card key={media.id} className="relative group">
                {/* 文件预览 */}
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                  {media.file_type === 'image' ? (
                    <img
                      src={media.file_url}
                      alt={media.title_zh || media.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.file_url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  )}
                </div>

                {/* 文件信息 */}
                <div className="space-y-2">
                  <Flex justifyContent="between" alignItems="start">
                    <div className="flex-1 min-w-0">
                      <Text className="font-medium truncate">
                        {media.title_zh || media.file_name}
                      </Text>
                      <Text className="text-xs text-gray-500 truncate">
                        {media.file_name}
                      </Text>
                    </div>
                    <Badge color={media.file_type === 'image' ? 'blue' : 'purple'}>
                      {media.file_type === 'image' ? '图片' : '视频'}
                    </Badge>
                  </Flex>

                  <Text className="text-xs text-gray-500">
                    {formatFileSize(media.file_size)} • {new Date(media.created_at).toLocaleDateString()}
                  </Text>

                  {/* 操作按钮 */}
                  <Flex className="gap-2 pt-2">
                    <Button
                      size="xs"
                      variant="secondary"
                      icon={Edit}
                      onClick={() => setEditingMedia(media as unknown as MediaFile)}
                      className="flex-1"
                    >
                      编辑
                    </Button>
                    <Button
                      size="xs"
                      variant="secondary"
                      color="red"
                      icon={Trash2}
                      onClick={() => handleDelete(Number(media.id))}
                    >
                      删除
                    </Button>
                  </Flex>
                </div>
              </Card>
            ))}
          </Grid>
        )}
      </Card>

      {/* 上传对话框 */}
      {showUploadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Flex justifyContent="between" alignItems="center" className="mb-4">
              <Title>上传{uploadType === 'image' ? '图片' : '视频'}</Title>
              <Button
                variant="light"
                icon={X}
                onClick={() => {
                  setShowUploadDialog(false);
                  setUploadedFileUrl('');
                }}
              />
            </Flex>

            <div className="space-y-4">
              {/* 文件上传组件 */}
              {uploadType === 'image' ? (
                <ImageUpload
                  value={uploadedFileUrl}
                  onChange={handleFileUploaded}
                  folder={folderFilter !== 'all' ? folderFilter : 'general'}
                />
              ) : (
                <VideoUpload
                  value={uploadedFileUrl}
                  onChange={handleFileUploaded}
                  folder={folderFilter !== 'all' ? folderFilter : 'general'}
                />
              )}

              {/* 操作按钮 */}
              <Flex justifyContent="end" className="gap-2 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowUploadDialog(false);
                    setUploadedFileUrl('');
                  }}
                >
                  取消
                </Button>
                <Button
                  onClick={handleSaveMedia}
                  disabled={!uploadedFileUrl}
                >
                  保存到媒体库
                </Button>
              </Flex>
            </div>
          </Card>
        </div>
      )}

      {/* 编辑元数据对话框 */}
      {editingMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <Flex justifyContent="between" alignItems="center" className="mb-4">
              <Title>编辑媒体文件</Title>
              <Button
                variant="light"
                icon={X}
                onClick={() => setEditingMedia(null)}
              />
            </Flex>

            <div className="space-y-6">
              {/* 文件预览 */}
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {editingMedia.file_type === 'image' ? (
                  <img
                    src={editingMedia.file_url}
                    alt={editingMedia.title_zh || editingMedia.file_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={editingMedia.file_url}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* 文件信息 */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Text className="text-xs text-gray-500">文件名</Text>
                  <Text className="font-medium">{editingMedia.file_name}</Text>
                </div>
                <div>
                  <Text className="text-xs text-gray-500">文件大小</Text>
                  <Text className="font-medium">{formatFileSize(editingMedia.file_size)}</Text>
                </div>
                <div>
                  <Text className="text-xs text-gray-500">文件类型</Text>
                  <Badge color={editingMedia.file_type === 'image' ? 'blue' : 'purple'}>
                    {editingMedia.file_type === 'image' ? '图片' : '视频'}
                  </Badge>
                </div>
                <div>
                  <Text className="text-xs text-gray-500">上传时间</Text>
                  <Text className="font-medium">
                    {new Date(editingMedia.created_at).toLocaleString()}
                  </Text>
                </div>
              </div>

              {/* 多语言标题 */}
              <div className="space-y-3">
                <Text className="font-medium">标题</Text>
                <div className="space-y-2">
                  <TextInput
                    placeholder="中文标题"
                    value={editingMedia.title_zh || ''}
                    onChange={(e) => setEditingMedia({
                      ...editingMedia,
                      title_zh: e.target.value
                    })}
                  />
                  <TextInput
                    placeholder="English Title"
                    value={editingMedia.title_en || ''}
                    onChange={(e) => setEditingMedia({
                      ...editingMedia,
                      title_en: e.target.value
                    })}
                  />
                  <TextInput
                    placeholder="Русский заголовок"
                    value={editingMedia.title_ru || ''}
                    onChange={(e) => setEditingMedia({
                      ...editingMedia,
                      title_ru: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* 多语言描述 */}
              <div className="space-y-3">
                <Text className="font-medium">描述</Text>
                <div className="space-y-2">
                  <Textarea
                    placeholder="中文描述"
                    value={editingMedia.description_zh || ''}
                    onChange={(e) => setEditingMedia({
                      ...editingMedia,
                      description_zh: e.target.value
                    })}
                    rows={3}
                  />
                  <Textarea
                    placeholder="English Description"
                    value={editingMedia.description_en || ''}
                    onChange={(e) => setEditingMedia({
                      ...editingMedia,
                      description_en: e.target.value
                    })}
                    rows={3}
                  />
                  <Textarea
                    placeholder="Русское описание"
                    value={editingMedia.description_ru || ''}
                    onChange={(e) => setEditingMedia({
                      ...editingMedia,
                      description_ru: e.target.value
                    })}
                    rows={3}
                  />
                </div>
              </div>

              {/* 使用位置 */}
              <div className="space-y-3">
                <Text className="font-medium">使用位置</Text>
                <Select
                  value={editingMedia.usage_location || ''}
                  onValueChange={(value) => setEditingMedia({
                    ...editingMedia,
                    usage_location: value
                  })}
                >
                  <SelectItem value="">未指定</SelectItem>
                  <SelectItem value="home_video">首页 - 演示视频</SelectItem>
                  <SelectItem value="home_oem">首页 - OEM定制</SelectItem>
                  <SelectItem value="home_semi">首页 - 半成品小袋</SelectItem>
                  <SelectItem value="oem_page">OEM页面</SelectItem>
                  <SelectItem value="products">产品页面</SelectItem>
                </Select>
              </div>

              {/* 操作按钮 */}
              <Flex justifyContent="end" className="gap-2 pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={() => setEditingMedia(null)}
                >
                  取消
                </Button>
                <Button onClick={handleUpdateMetadata}>
                  保存更改
                </Button>
              </Flex>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

