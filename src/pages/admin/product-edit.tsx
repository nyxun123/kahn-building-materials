import { useEffect } from "react";
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
  category?: string;
  price?: number;
  price_range?: string;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
  features_zh?: string;
  features_en?: string;
  features_ru?: string;
}

const ProductEditor = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreate = !params.id || params.id === "new";

  const {
    refineCore: { formLoading, onFinish, queryResult },
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    refineCoreProps: {
      resource: "products",
      id: isCreate ? undefined : params.id,
      action: isCreate ? "create" : "edit",
      redirect: false,
    },
    defaultValues: {
      is_active: true,
      sort_order: 0,
    },
  });

  useEffect(() => {
    const record = queryResult?.data?.data as any;
    if (record) {
      if (record.features_zh && typeof record.features_zh === "string") {
        try {
          const parsed = JSON.parse(record.features_zh);
          setValue("features_zh", Array.isArray(parsed) ? parsed.join("\n") : record.features_zh);
        } catch {
          setValue("features_zh", record.features_zh);
        }
      }
      if (record.features_en && typeof record.features_en === "string") {
        try {
          const parsed = JSON.parse(record.features_en);
          setValue("features_en", Array.isArray(parsed) ? parsed.join("\n") : record.features_en);
        } catch {
          setValue("features_en", record.features_en);
        }
      }
      if (record.features_ru && typeof record.features_ru === "string") {
        try {
          const parsed = JSON.parse(record.features_ru);
          setValue("features_ru", Array.isArray(parsed) ? parsed.join("\n") : record.features_ru);
        } catch {
          setValue("features_ru", record.features_ru);
        }
      }
    }
  }, [queryResult, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    const payload: any = {
      ...values,
      is_active: Boolean(values.is_active),
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
  );
};

export default ProductEditor;
