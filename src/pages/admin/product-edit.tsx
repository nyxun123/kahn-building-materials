import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@refinedev/react-hook-form";
import {
  Card,
  Grid,
  Flex,
  Button,
  Title,
  Text,
} from "@tremor/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Save, ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface ProductFormValues {
  product_code: string;
  name_zh: string;
  name_en: string;
  name_ru?: string;
  description_zh?: string;
  description_en?: string;
  description_ru?: string;
  specifications_zh?: string;
  specifications_en?: string;
  specifications_ru?: string;
  applications_zh?: string;
  applications_en?: string;
  applications_ru?: string;
  category?: string;
  price?: number;
  price_range?: string;
  image_url?: string;
  gallery_images?: string;
  packaging_options_zh?: string;
  packaging_options_en?: string;
  packaging_options_ru?: string;
  tags?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  stock_quantity?: number;
  min_order_quantity?: number;
  meta_title_zh?: string;
  meta_title_en?: string;
  meta_title_ru?: string;
  meta_description_zh?: string;
  meta_description_en?: string;
  meta_description_ru?: string;
  features_zh?: string;
  features_en?: string;
  features_ru?: string;
}

const ProductEditor = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreate = !params.id || params.id === "new";
  
  // 添加数据加载完成状态
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  const {
    refineCore: { formLoading, onFinish, queryResult },
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState,
    getValues,
  } = useForm<ProductFormValues>({
    refineCoreProps: {
      resource: "products",
      id: isCreate ? undefined : params.id,
      action: isCreate ? "create" : "edit",
      redirect: false,
    },
    mode: "onChange", // 启用实时验证
    defaultValues: isCreate ? {
      product_code: "",
      name_zh: "",
      name_en: "",
      category: "adhesive",
      price: 0,
      is_active: true,
      is_featured: false,
      sort_order: 0,
      stock_quantity: 0,
      min_order_quantity: 1
    } : undefined, // 创建模式设置默认值，编辑模式由数据加载后设置
  });

  // 调试用：监控表单状态
  useEffect(() => {
    console.log('🔄 表单状态变化:', {
      isDirty: formState.isDirty,
      isValid: formState.isValid,
      dirtyFields: Object.keys(formState.dirtyFields),
      touchedFields: Object.keys(formState.touchedFields),
      dataLoaded,
      formInitialized
    });
  }, [formState, dataLoaded, formInitialized]);

  // 数据加载和表单初始化逻辑 - 针对生产环境优化
  useEffect(() => {
    console.log('🔄 ProductEditor useEffect triggered', {
      queryResult: queryResult?.data,
      loading: queryResult?.isLoading,
      error: queryResult?.error,
      isCreate,
      dataLoaded,
      formInitialized
    });
    
    // 只在编辑模式下才处理数据回显
    if (isCreate) {
      console.log('🆕 创建模式，设置为已初始化');
      setFormInitialized(true);
      setDataLoaded(true);
      return;
    }
    
    // 检查数据是否加载完成
    if (queryResult?.isLoading) {
      console.log('⏳ 数据加载中...');
      setDataLoaded(false);
      setFormInitialized(false);
      return;
    }
    
    if (queryResult?.error) {
      console.error('❌ 数据加载错误:', queryResult.error);
      toast.error(`加载产品数据失败: ${queryResult.error.message || '未知错误'}`);
      return;
    }
    
    const record = queryResult?.data?.data as any;
    console.log('📦 原始记录数据:', record);
    
    // 增强数据验证
    if (!record) {
      console.warn('⚠️ 没有找到产品记录数据');
      toast.error('未找到指定的产品，请检查产品ID');
      navigate('/admin/products');
      return;
    }
    
    if (!record.id && !record.product_code) {
      console.warn('⚠️ 产品数据格式无效，缺少关键字段');
      toast.error('产品数据格式无效');
      return;
    }
    
    if (Object.keys(record).length === 0) {
      console.warn('⚠️ 产品数据为空对象');
      toast.error('产品数据为空');
      return;
    }
    
    if (!formInitialized) {
      console.log('📝 开始初始化表单数据...');
      
      // 准备表单数据，保持完整的字段结构 - 针对Cloudflare环境优化
      const formData: ProductFormValues = {
        product_code: String(record.product_code || ''),
        name_zh: String(record.name_zh || ''),
        name_en: String(record.name_en || ''),
        name_ru: String(record.name_ru || ''),
        description_zh: String(record.description_zh || ''),
        description_en: String(record.description_en || ''),
        description_ru: String(record.description_ru || ''),
        specifications_zh: String(record.specifications_zh || ''),
        specifications_en: String(record.specifications_en || ''),
        specifications_ru: String(record.specifications_ru || ''),
        applications_zh: String(record.applications_zh || ''),
        applications_en: String(record.applications_en || ''),
        applications_ru: String(record.applications_ru || ''),
        category: String(record.category || 'adhesive'),
        price: typeof record.price === 'number' ? record.price : (parseFloat(String(record.price)) || 0),
        price_range: String(record.price_range || ''),
        image_url: String(record.image_url || ''),
        gallery_images: String(record.gallery_images || ''),
        packaging_options_zh: String(record.packaging_options_zh || ''),
        packaging_options_en: String(record.packaging_options_en || ''),
        packaging_options_ru: String(record.packaging_options_ru || ''),
        tags: String(record.tags || ''),
        is_active: Boolean(record.is_active && record.is_active !== 0 && record.is_active !== '0'), // 处理多种false值
        is_featured: Boolean(record.is_featured && record.is_featured !== 0 && record.is_featured !== '0'),
        sort_order: typeof record.sort_order === 'number' ? record.sort_order : (parseInt(String(record.sort_order)) || 0),
        stock_quantity: typeof record.stock_quantity === 'number' ? record.stock_quantity : (parseInt(String(record.stock_quantity)) || 0),
        min_order_quantity: typeof record.min_order_quantity === 'number' ? record.min_order_quantity : (parseInt(String(record.min_order_quantity)) || 1),
        meta_title_zh: String(record.meta_title_zh || ''),
        meta_title_en: String(record.meta_title_en || ''),
        meta_title_ru: String(record.meta_title_ru || ''),
        meta_description_zh: String(record.meta_description_zh || ''),
        meta_description_en: String(record.meta_description_en || ''),
        meta_description_ru: String(record.meta_description_ru || ''),
        features_zh: '',
        features_en: '',
        features_ru: '',
      };
      
      // 特殊处理 features 字段（JSON数组转换为换行分隔文本）- 增强错误处理
      const processFeatures = (featuresData: any, fieldName: string): string => {
        if (!featuresData) return '';
        
        try {
          // 如果已经是字符串且包含换行，直接返回
          if (typeof featuresData === 'string' && featuresData.includes('\n')) {
            return featuresData;
          }
          
          // 尝试解析JSON
          const parsed = typeof featuresData === 'string' ? JSON.parse(featuresData) : featuresData;
          if (Array.isArray(parsed)) {
            return parsed.filter(item => item && item.trim()).join('\n');
          } else {
            return String(featuresData || '');
          }
        } catch (error) {
          console.warn(`解析${fieldName}字段失败:`, featuresData, error);
          return String(featuresData || '');
        }
      };
      
      formData.features_zh = processFeatures(record.features_zh, 'features_zh');
      formData.features_en = processFeatures(record.features_en, 'features_en');
      formData.features_ru = processFeatures(record.features_ru, 'features_ru');
      
      console.log('📋 准备的表单数据:', formData);
      
      // 验证表单数据的关键字段
      const keyFields = ['product_code', 'name_zh', 'category'];
      const missingFields = keyFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        console.warn('⚠️ 关键字段缺失:', missingFields);
        toast.error(`产品数据不完整，缺少: ${missingFields.join(', ')}`);
        return;
      }
      
      // 分步设置表单数据，确保稳定性 - 针对Cloudflare环境优化
      const setFormData = () => {
        console.log('🔄 执行reset操作...');
        
        try {
          // 先重置表单
          reset(formData, { 
            keepDefaultValues: false,
            keepDirty: false,
            keepTouched: false
          });
          
          // 逐个设置关键字段确保设置成功
          Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              try {
                setValue(key as keyof ProductFormValues, value, { 
                  shouldValidate: false,
                  shouldDirty: false,
                  shouldTouch: false
                });
              } catch (setError) {
                console.warn(`设置字段${key}失败:`, setError);
              }
            }
          });
          
          // 标记数据已加载和表单已初始化
          setDataLoaded(true);
          setFormInitialized(true);
          
          console.log('✅ 表单数据初始化完成');
          
          // 延迟验证数据是否正确设置 - 增加验证时间以适应生产环境
          setTimeout(() => {
            try {
              const currentValues = getValues();
              console.log('🔍 验证表单数据设置结果:');
              let successCount = 0;
              const totalCount = Object.keys(formData).length;
              
              Object.entries(formData).forEach(([key, expectedValue]) => {
                const actualValue = currentValues[key as keyof ProductFormValues];
                const match = actualValue === expectedValue;
                if (match) successCount++;
                console.log(`   ${key}: ${match ? '✅' : '❌'} ${match ? '匹配' : `期望(${expectedValue}) != 实际(${actualValue})`}`);
              });
              
              const successRate = Math.round((successCount / totalCount) * 100);
              console.log(`📊 数据设置成功率: ${successCount}/${totalCount} (${successRate}%)`);
              
              if (successRate < 70) {
                console.warn('⚠️ 数据设置成功率较低，可能存在问题');
                toast.error('部分数据加载可能不完整，请刷新重试');
              } else {
                console.log('🎉 数据加载完成，可以正常编辑');
                toast.success('产品数据加载完成');
              }
            } catch (validationError) {
              console.error('❌ 数据验证失败:', validationError);
            }
          }, 500); // 增加验证延迟以适应生产环境
          
        } catch (resetError) {
          console.error('❌ 表单重置失败:', resetError);
          toast.error('表单初始化失败，请刷新页面重试');
        }
      };
      
      // 使用多重异步机制确保DOM渲染完成 - 针对Cloudflare环境优化
      requestAnimationFrame(() => {
        setTimeout(() => {
          requestAnimationFrame(() => {
            setTimeout(setFormData, 200); // 增加延迟以适应生产环境的网络延迟
          });
        }, 100);
      });
      
    } else if (record && formInitialized) {
      console.log('🔄 数据已初始化，跳过重复处理');
      setDataLoaded(true);
    }
  }, [queryResult, reset, setValue, getValues, isCreate, formInitialized, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    const payload: any = {
      ...values,
      is_active: Boolean(values.is_active),
      // 保留base64图片数据，不自动清空
      image_url: values.image_url, // 支持base64和HTTPS URL
      features_zh: values.features_zh
        ? values.features_zh.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      features_en: values.features_en
        ? values.features_en.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      features_ru: values.features_ru
        ? values.features_ru.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
    };

    try {
      await onFinish(payload);
      toast.success(isCreate ? "产品创建成功" : "产品更新成功");
      navigate("/admin/products");
    } catch (error) {
      console.error("保存产品失败", error);
      // 显示具体的错误信息
      const errorMessage = error?.message || error?.response?.data?.message || "保存失败，请重试";
      toast.error(errorMessage);
    }
  });

  return (
    <>
      {/* 编辑模式下的加载状态 */}
      {!isCreate && (queryResult?.isLoading || !formInitialized) && (
        <Card className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-4"></div>
              <Text className="text-slate-600">
                {queryResult?.isLoading ? '正在加载产品数据...' : '正在初始化表单...'}
              </Text>
            </div>
          </div>
        </Card>
      )}
      
      {/* 数据加载完成和表单初始化完成后显示表单 */}
      {(isCreate || (formInitialized && !queryResult?.isLoading)) && (
        <Card className="space-y-6">
      <Flex justifyContent="between" alignItems="center">
        <div>
          <Title className="text-xl font-semibold text-slate-900">
            {isCreate ? "新增产品" : `编辑产品 #${params.id}`}
          </Title>
          <Text className="text-sm text-slate-500">
            请完善产品的多语言信息，保持官网展示一致
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
            返回
          </Button>
          <Button icon={Save} loading={formLoading} onClick={onSubmit}>
            保存
          </Button>
        </div>
      </Flex>

      <Grid numItemsSm={1} numItemsLg={2} className="gap-4">
        <div>
          <Text className="text-sm font-medium text-slate-600">产品编码</Text>
          <Input {...register("product_code")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">所属分类</Text>
          <Input placeholder="例如：adhesive" {...register("category")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">中文名称</Text>
          <Input {...register("name_zh")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">英文名称</Text>
          <Input {...register("name_en")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">俄文名称</Text>
          <Input {...register("name_ru")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">产品价格</Text>
          <Input type="number" step="0.01" placeholder="0.00" {...register("price", { valueAsNumber: true })} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">主图地址</Text>
          <Input placeholder="https://" {...register("image_url")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">价格区间</Text>
          <Input placeholder="例如：￥100-￥150" {...register("price_range")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">排序权重</Text>
          <Input type="number" {...register("sort_order", { valueAsNumber: true })} />
        </div>
      </Grid>

      <Card className="bg-slate-50">
        <Text className="text-sm font-medium text-slate-600">上传主图</Text>
        <div className="mt-3">
          <ImageUpload
            value={watch("image_url") || ""}
            onChange={(url) => setValue("image_url", url, { shouldDirty: true })}
          />
        </div>
      </Card>

      <Grid numItemsSm={1} numItemsLg={2} className="gap-4">
        <div>
          <Text className="text-sm font-medium text-slate-600">中文规格</Text>
          <Textarea className="mt-1 min-h-[100px]" placeholder="产品规格和技术参数" {...register("specifications_zh")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">英文规格</Text>
          <Textarea className="mt-1 min-h-[100px]" placeholder="Product specifications" {...register("specifications_en")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">俄文规格</Text>
          <Textarea className="mt-1 min-h-[100px]" placeholder="Технические характеристики" {...register("specifications_ru")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">中文应用</Text>
          <Textarea className="mt-1 min-h-[100px]" placeholder="产品应用场景和用途" {...register("applications_zh")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">英文应用</Text>
          <Textarea className="mt-1 min-h-[100px]" placeholder="Applications and use cases" {...register("applications_en")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">俄文应用</Text>
          <Textarea className="mt-1 min-h-[100px]" placeholder="Применения и случаи использования" {...register("applications_ru")} />
        </div>
      </Grid>

      <Grid numItemsSm={1} numItemsLg={2} className="gap-4">
        <div>
          <Text className="text-sm font-medium text-slate-600">中文简介</Text>
          <Textarea className="mt-1 min-h-[140px]" {...register("description_zh")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">英文简介</Text>
          <Textarea className="mt-1 min-h-[140px]" {...register("description_en")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">俄文简介</Text>
          <Textarea className="mt-1 min-h-[140px]" {...register("description_ru")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">中文卖点（每行一条）</Text>
          <Textarea className="mt-1 min-h-[140px]" {...register("features_zh")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">英文卖点（每行一条）</Text>
          <Textarea className="mt-1 min-h-[140px]" {...register("features_en")} />
        </div>
        <div>
          <Text className="text-sm font-medium text-slate-600">俄文卖点（每行一条）</Text>
          <Textarea className="mt-1 min-h-[140px]" {...register("features_ru")} />
        </div>
      </Grid>

      <Card className="bg-slate-50">
        <Flex justifyContent="between" alignItems="center">
          <div>
            <Text className="font-medium text-slate-700">是否上架</Text>
            <Text className="text-sm text-slate-500">关闭后产品将隐藏在官网列表</Text>
          </div>
          <input
            type="checkbox"
            className="h-5 w-10 cursor-pointer rounded-full border border-slate-300"
            checked={watch("is_active") ?? true}
            onChange={(event) => setValue("is_active", event.target.checked)}
          />
        </Flex>
      </Card>
    </Card>
      )}
    </>
  );
};

export default ProductEditor;
