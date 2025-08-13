import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ypjtdfsociepbzfvxzha.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w';

const supabase = createClient(supabaseUrl, supabaseKey);

// 页面内容更新
async function updatePageContents() {
  console.log('开始更新页面内容...');

  // 首页英雄区内容
  try {
    const { data: existingHero, error: checkHeroError } = await supabase
      .from('page_contents')
      .select('id')
      .eq('page_key', 'home')
      .eq('section_key', 'hero_background')
      .single();

    if (checkHeroError && checkHeroError.code === 'PGRST116') {
      // 创建英雄区背景图片内容
      console.log('创建首页英雄区背景内容');
      const { error: insertError } = await supabase
        .from('page_contents')
        .insert({
          page_key: 'home',
          section_key: 'hero_background',
          content_zh: '/images/wallpaper_adhesive_powder_manufacturing_equipment.jpg',
          content_en: '/images/wallpaper_adhesive_powder_manufacturing_equipment.jpg',
          content_ru: '/images/wallpaper_adhesive_powder_manufacturing_equipment.jpg',
          content_type: 'text',
          is_active: true
        });

      if (insertError) {
        console.error('创建英雄区背景失败:', insertError);
      } else {
        console.log('英雄区背景创建成功');
      }
    } else if (existingHero) {
      // 更新英雄区背景图片
      console.log('更新首页英雄区背景');
      const { error: updateError } = await supabase
        .from('page_contents')
        .update({
          content_zh: '/images/wallpaper_adhesive_powder_manufacturing_equipment.jpg',
          content_en: '/images/wallpaper_adhesive_powder_manufacturing_equipment.jpg',
          content_ru: '/images/wallpaper_adhesive_powder_manufacturing_equipment.jpg'
        })
        .eq('id', existingHero.id);

      if (updateError) {
        console.error('更新英雄区背景失败:', updateError);
      } else {
        console.log('英雄区背景更新成功');
      }
    }
  } catch (error) {
    console.error('处理英雄区内容时出错:', error);
  }

  // 创建视频区内容
  try {
    const { data: existingVideo, error: checkVideoError } = await supabase
      .from('page_contents')
      .select('id')
      .eq('page_key', 'home')
      .eq('section_key', 'video_section_title')
      .single();

    if (checkVideoError && checkVideoError.code === 'PGRST116') {
      // 创建视频区标题
      console.log('创建视频区标题');
      const { error: insertTitleError } = await supabase
        .from('page_contents')
        .insert({
          page_key: 'home',
          section_key: 'video_section_title',
          content_zh: '产品演示视频',
          content_en: 'Product Demonstration Video',
          content_ru: 'Демонстрационное видео продукта',
          content_type: 'text',
          is_active: true
        });

      if (insertTitleError) {
        console.error('创建视频区标题失败:', insertTitleError);
      } else {
        console.log('视频区标题创建成功');
      }
    }

    // 创建视频区副标题
    const { data: existingVideoSub, error: checkVideoSubError } = await supabase
      .from('page_contents')
      .select('id')
      .eq('page_key', 'home')
      .eq('section_key', 'video_section_subtitle')
      .single();

    if (checkVideoSubError && checkVideoSubError.code === 'PGRST116') {
      console.log('创建视频区副标题');
      const { error: insertSubError } = await supabase
        .from('page_contents')
        .insert({
          page_key: 'home',
          section_key: 'video_section_subtitle',
          content_zh: '观看我们墙纸胶产品如何轻松快速地与清水混合并应用于墙纸安装',
          content_en: 'Watch how our wallpaper paste products easily mix with water and apply to wallpaper installation',
          content_ru: 'Посмотрите, как наши обои легко смешиваются с водой и наносятся на обои',
          content_type: 'text',
          is_active: true
        });

      if (insertSubError) {
        console.error('创建视频区副标题失败:', insertSubError);
      } else {
        console.log('视频区副标题创建成功');
      }
    }

    // 创建视频地址
    const { data: existingVideoUrl, error: checkVideoUrlError } = await supabase
      .from('page_contents')
      .select('id')
      .eq('page_key', 'home')
      .eq('section_key', 'video_url')
      .single();

    if (checkVideoUrlError && checkVideoUrlError.code === 'PGRST116') {
      console.log('创建视频地址');
      const { error: insertUrlError } = await supabase
        .from('page_contents')
        .insert({
          page_key: 'home',
          section_key: 'video_url',
          content_zh: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content_en: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content_ru: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content_type: 'text',
          is_active: true
        });

      if (insertUrlError) {
        console.error('创建视频地址失败:', insertUrlError);
      } else {
        console.log('视频地址创建成功');
      }
    }
  } catch (error) {
    console.error('处理视频区内容时出错:', error);
  }

  console.log('页面内容更新完成');
}

updatePageContents();
