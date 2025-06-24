// tags_parameter.js
(function() {
  const parameterData = {
    group: "参数 (Parameters)",
    categories: [
      {
        name: "模型版本 (Model Version)",
        tags: [
          { zh: "模型版本 7", en: "--v 7" },
          { zh: "模型版本 6.1", en: "--v 6.1" },
          { zh: "模型版本 6.0", en: "--v 6.0" },
          { zh: "模型版本 5.2", en: "--v 5.2" },
          { zh: "模型版本 5.1", en: "--v 5.1" },
          { zh: "模型版本 5.0", en: "--v 5.0" },
          { zh: "模型版本 4", en: "--v 4" },
          { zh: "模型版本 3", en: "--v 3" },
          { zh: "模型版本 2", en: "--v 2" },
          { zh: "模型版本 1", en: "--v 1" },
          { zh: "Niji 模型版本 6", en: "--niji 6" },
          { zh: "Niji 模型版本 5", en: "--niji 5" },
          { zh: "Niji 模型版本 4", en: "--niji 4" }
        ]
      },
      {
        name: "风格模型 (Style Mode)",
        tags: [
          { zh: "风格模式: 原始", en: "--style raw" },
          { zh: "风格模式: 可爱", en: "--style cute" },
          { zh: "风格模式: 富有表现力", en: "--style expressive" },
          { zh: "风格模式: 原始/默认", en: "--style original" },
          { zh: "风格模式: 风景", en: "--style scenic" },
          { zh: "风格模式: 4a", en: "--style 4a" },
          { zh: "风格模式: 4b", en: "--style 4b" },
          { zh: "风格模式: 4c", en: "--style 4c" }
        ]
      },
      {
        name: "风格化 (--stylize)",
        tags: [
          { zh: "风格化: 0", en: "--s 0" },
          { zh: "风格化: 50", en: "--s 50" },
          { zh: "风格化: 100", en: "--s 100" },
          { zh: "风格化: 150", en: "--s 150" },
          { zh: "风格化: 180", en: "--s 180" },
          { zh: "风格化: 200", en: "--s 200" },
          { zh: "风格化: 250", en: "--s 250" },
          { zh: "风格化: 500", en: "--s 500" },
          { zh: "风格化: 750", en: "--s 750" },
          { zh: "风格化: 1000", en: "--s 1000" }
        ]
      },
      {
        name: "宽高比 (Aspect Ratios)",
        tags: [
          { zh: "宽高比: 1:1 (正方形)", en: "--ar 1:1" },
          { zh: "宽高比: 2:1", en: "--ar 2:1" },
          { zh: "宽高比: 1:2", en: "--ar 1:2" },
          { zh: "宽高比: 2:3 (竖版)", en: "--ar 2:3" },
          { zh: "宽高比: 3:4 (竖版)", en: "--ar 3:4" },
          { zh: "宽高比: 3:5 (竖版)", en: "--ar 3:5" },
          { zh: "宽高比: 9:16 (竖版)", en: "--ar 9:16" },
          { zh: "宽高比: 9:20 (竖版)", en: "--ar 9:20" },
          { zh: "宽高比: 16:9 (宽屏)", en: "--ar 16:9" },
          { zh: "宽高比: 20:9 (超宽屏)", en: "--ar 20:9" }
        ]
      },
      {
        name: "混乱值 (Chaos)",
        tags: [
          { zh: "混乱值: 0", en: "--c 0" },
          { zh: "混乱值: 5", en: "--c 5" },
          { zh: "混乱值: 10", en: "--c 10" },
          { zh: "混乱值: 20", en: "--c 20" },
          { zh: "混乱值: 50", en: "--c 50" },
          { zh: "混乱值: 100", en: "--c 100" }
        ]
      },
      {
        name: "怪异化 (Weird)",
        tags: [
          { zh: "怪异化: 0 (关闭)", en: "--w 0" },
          { zh: "怪异化: 50", en: "--w 50" },
          { zh: "怪异化: 100", en: "--w 100" },
          { zh: "怪异化: 250", en: "--w 250" },
          { zh: "怪异化: 500", en: "--w 500" },
          { zh: "怪异化: 1000", en: "--w 1000" },
          { zh: "怪异化: 3000 (最大)", en: "--w 3000" }
        ]
      },
      {
        name: "其他参数 (Other Parameters)",
        tags: [
          { zh: "风格参考图片", en: "--sref URL" },
          { zh: "角色参考图片", en: "--cref URL" },
          { zh: "美学参考图片", en: "--oref URL" },
          { zh: "风格权重: 250", en: "--sw 250" },
          { zh: "角色权重: 50", en: "--cw 50" },
          { zh: "美学权重: 100", en: "--ow 100" },
          { zh: "图像混合权重: 3", en: "--iw 3" },
          { zh: "个性化/训练", en: "--personalize" },
          { zh: "平铺模式", en: "--tile" },
          { zh: "排除/负面提示", en: "--no" },
          { zh: "快速模式", en: "--fast" },
          { zh: "放松模式", en: "--relax" },
          { zh: "涡轮模式", en: "--turbo" }
        ]
      }
    ]
  };

  parameterData.categories.forEach(category => {
    category.tags.forEach(tag => {
      tag.isParameter = true;
    });
  });

  tagData.push(parameterData);
})();