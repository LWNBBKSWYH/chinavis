# chinavis

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
### 核心框架

Vue 3

- 作为整个项目的前端框架
- 使用了Vue的响应式系统(ref, computed等)
- 使用了Vue Router进行页面导航

### 3D可视化

1. **Three.js** (版本^0.176.0)
   - 用于主页面3D地球的渲染
   - 使用了SphereGeometry创建地球模型
   - 使用了MeshPhongMaterial实现材质效果
   - 使用了WebGLRenderer进行渲染
2. **Tween.js** (@tweenjs/tween.js)（版本^25.0.0）
   - 用于创建平滑的动画过渡效果
   - 控制相机移动动画
   - 使用了TWEEN.Group管理动画组

### 地图相关

maplibre-gl（版本^3.6.2）

- 用于时间轴页面(MapExplorer)的地图渲染
- 基于WebGL的矢量地图渲染库
- 使用了GeoJSON数据源显示长城

### 其他工具库

1. 

   horizontal-scroll

   - 用于实现故事页面的横向滚动效果

### CSS相关

- 使用了现代CSS特性：
  - `clamp()`函数实现响应式字体
  - `backdrop-filter`实现毛玻璃效果
  - CSS变量和v-bind实现动态样式
  - 使用了CSS渐变和滤镜效果
