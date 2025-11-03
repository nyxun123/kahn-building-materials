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
  Search,
  Grid3x3,
  List
} from "lucide-react";
import { toast } from "react-hot-toast";
import { MediaUpload, PageHeader, PageContent, TabLangInput, FormSection } from "@/components/admin";

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    <PageContent maxWidth="2xl">
      <div className="space-y-6">
        <PageHeader
          title="媒体库"
          description="管理网站的图片和视频文件"
          actions={
            <>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
                <Button
                  variant="light"
                  size="sm"
                  icon={Grid3x3}
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : ''}
                >
                  网格
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  icon={List}
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : ''}
                >
                  列表
                </Button>
              </div>
              <Button
                icon={ImageIcon}
                onClick={() => {
                  setUploadType('image');
                  setShowUploadDialog(true);
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                上传图片
              </Button>
              <Button
                icon={Video}
                onClick={() => {
                  setUploadType('video');
                  setShowUploadDialog(true);
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                上传视频
              </Button>
            </>
          }
        />

        {/* 操作栏 */}
        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <Flex justifyContent="between" alignItems="center" className="gap-4">
            <Flex alignItems="center" className="gap-3 flex-1">
              {/* 搜索 */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <TextInput
                  placeholder="搜索文件名、标题、描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
              </div>

              {/* 文件类型筛选 */}
              <Select
                value={fileTypeFilter}
                onValueChange={setFileTypeFilter}
                className="border-2 border-gray-200 rounded-lg focus:border-indigo-500"
              >
                <SelectItem value="all">所有类型</SelectItem>
                <SelectItem value="image">图片</SelectItem>
                <SelectItem value="video">视频</SelectItem>
              </Select>

              {/* 文件夹筛选 */}
              <Select
                value={folderFilter}
                onValueChange={setFolderFilter}
                className="border-2 border-gray-200 rounded-lg focus:border-indigo-500"
              >
                <SelectItem value="all">所有文件夹</SelectItem>
                <SelectItem value="home">首页</SelectItem>
                <SelectItem value="oem">OEM</SelectItem>
                <SelectItem value="products">产品</SelectItem>
                <SelectItem value="general">通用</SelectItem>
              </Select>
            </Flex>
          </Flex>
        </Card>

        {/* 统计信息 */}
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4">
          <Card className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-l-4 border-l-indigo-500 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Text className="text-sm font-medium text-gray-600">总文件数</Text>
            <Title className="mt-2 text-3xl font-bold text-gray-900">{mediaFiles.length}</Title>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-l-4 border-l-emerald-500 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Text className="text-sm font-medium text-gray-600">图片</Text>
            <Title className="mt-2 text-3xl font-bold text-gray-900">
              {mediaFiles.filter(m => m.file_type === 'image').length}
            </Title>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-l-4 border-l-purple-500 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Text className="text-sm font-medium text-gray-600">视频</Text>
            <Title className="mt-2 text-3xl font-bold text-gray-900">
              {mediaFiles.filter(m => m.file_type === 'video').length}
            </Title>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-l-4 border-l-amber-500 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Text className="text-sm font-medium text-gray-600">搜索结果</Text>
            <Title className="mt-2 text-3xl font-bold text-gray-900">{filteredMedia.length}</Title>
          </Card>
        </Grid>

        {/* 媒体文件网格/列表 */}
        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          {isLoading ? (
            <div className="text-center py-12">
              <Text className="text-gray-500">加载中...</Text>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <ImageIcon className="h-16 w-16 text-gray-300" />
                <Text className="text-gray-500 text-lg">暂无媒体文件</Text>
                <Button
                  icon={Upload}
                  onClick={() => {
                    setUploadType('image');
                    setShowUploadDialog(true);
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200"
                >
                  上传第一个文件
                </Button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <Grid numItems={2} numItemsSm={3} numItemsLg={4} className="gap-4">
              {filteredMedia.map((media) => (
                <Card
                  key={media.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group overflow-hidden"
                >
                  {/* 文件预览 */}
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative mb-3">
                    {media.file_type === 'image' ? (
                      <img
                        src={media.file_url}
                        alt={media.title_zh || media.file_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <video
                        src={media.file_url}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    )}
                    {/* 悬停覆盖层 */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          variant="secondary"
                          icon={Edit}
                          onClick={() => setEditingMedia(media as unknown as MediaFile)}
                          className="bg-white text-gray-700 hover:bg-indigo-50"
                        >
                          编辑
                        </Button>
                        <Button
                          size="xs"
                          icon={Trash2}
                          onClick={() => handleDelete(Number(media.id))}
                          className="bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700"
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 文件信息 */}
                  <div className="space-y-2 px-2 pb-2">
                    <Flex justifyContent="between" alignItems="start">
                      <div className="flex-1 min-w-0">
                        <Text className="font-semibold text-gray-900 truncate">
                          {media.title_zh || media.file_name}
                        </Text>
                        <Text className="text-xs text-gray-500 truncate">
                          {media.file_name}
                        </Text>
                      </div>
                      <Badge
                        color={media.file_type === 'image' ? 'blue' : 'purple'}
                        className="rounded-full px-2 py-1 ml-2"
                      >
                        {media.file_type === 'image' ? '图片' : '视频'}
                      </Badge>
                    </Flex>

                    <Text className="text-xs text-gray-500">
                      {formatFileSize(media.file_size)} • {new Date(media.created_at).toLocaleDateString()}
                    </Text>
                  </div>
                </Card>
              ))}
            </Grid>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((media) => (
                <Card
                  key={media.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
                >
                  <Flex alignItems="center" className="gap-4">
                    {/* 缩略图 */}
                    <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <Flex justifyContent="between" alignItems="start" className="mb-1">
                        <Text className="font-semibold text-gray-900 truncate">
                          {media.title_zh || media.file_name}
                        </Text>
                        <Badge
                          color={media.file_type === 'image' ? 'blue' : 'purple'}
                          className="rounded-full px-2 py-1 ml-2"
                        >
                          {media.file_type === 'image' ? '图片' : '视频'}
                        </Badge>
                      </Flex>
                      <Text className="text-sm text-gray-500 truncate mb-1">
                        {media.file_name}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {formatFileSize(media.file_size)} • {new Date(media.created_at).toLocaleDateString()}
                      </Text>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Edit}
                        onClick={() => setEditingMedia(media as unknown as MediaFile)}
                        className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                      >
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(Number(media.id))}
                        className="bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 hover:shadow-lg transition-all duration-200"
                      >
                        删除
                      </Button>
                    </div>
                  </Flex>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* 上传对话框 */}
        {showUploadDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
              <Flex justifyContent="between" alignItems="center" className="mb-6">
                <Title className="text-xl font-bold text-gray-900">
                  上传{uploadType === 'image' ? '图片' : '视频'}
                </Title>
                <Button
                  variant="light"
                  icon={X}
                  onClick={() => {
                    setShowUploadDialog(false);
                    setUploadedFileUrl('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                />
              </Flex>

              <div className="space-y-6">
                {/* 文件上传组件 */}
                <MediaUpload
                  value={uploadedFileUrl}
                  onChange={handleFileUploaded}
                  folder={folderFilter !== 'all' ? folderFilter : 'general'}
                  type={uploadType}
                  preview={true}
                />

                {/* 操作按钮 */}
                <Flex justifyContent="end" className="gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowUploadDialog(false);
                      setUploadedFileUrl('');
                    }}
                    className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleSaveMedia}
                    disabled={!uploadedFileUrl}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
              <Flex justifyContent="between" alignItems="center" className="mb-6">
                <Title className="text-xl font-bold text-gray-900">编辑媒体文件</Title>
                <Button
                  variant="light"
                  icon={X}
                  onClick={() => setEditingMedia(null)}
                  className="text-gray-400 hover:text-gray-600"
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
              <TabLangInput
                label="标题"
                values={{
                  zh: editingMedia.title_zh || '',
                  en: editingMedia.title_en || '',
                  ru: editingMedia.title_ru || '',
                }}
                onChange={(lang, value) => {
                  setEditingMedia({
                    ...editingMedia,
                    [`title_${lang}`]: value,
                  });
                }}
                type="text"
              />

              {/* 多语言描述 */}
              <TabLangInput
                label="描述"
                values={{
                  zh: editingMedia.description_zh || '',
                  en: editingMedia.description_en || '',
                  ru: editingMedia.description_ru || '',
                }}
                onChange={(lang, value) => {
                  setEditingMedia({
                    ...editingMedia,
                    [`description_${lang}`]: value,
                  });
                }}
                type="textarea"
              />

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
              <Flex justifyContent="end" className="gap-3 pt-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={() => setEditingMedia(null)}
                  className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  取消
                </Button>
                <Button
                  onClick={handleUpdateMetadata}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200"
                >
                  保存更改
                </Button>
              </Flex>
            </div>
          </Card>
        </div>
        )}
      </div>
    </PageContent>
  );
}

