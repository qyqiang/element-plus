---
title: Installation
lang: en-US
---

# Installation

## Compatibility ^(2.5.0)

Element Plus can run on browsers that support last 2 versions.

If you really need to support outdated browsers, please add Babel and Polyfill yourself.

Since Vue 3 no longer supports IE11, Element Plus does not support IE either.

| version | ![Chrome](https://cdn.jsdelivr.net/npm/@browser-logos/chrome/chrome_32x32.png) <br> Chrome | ![IE](https://cdn.jsdelivr.net/npm/@browser-logos/edge/edge_32x32.png) <br> Edge | ![Firefox](https://cdn.jsdelivr.net/npm/@browser-logos/firefox/firefox_32x32.png) <br> Firefox | ![Safari](https://cdn.jsdelivr.net/npm/@browser-logos/safari/safari_32x32.png) <br> Safari |
| ------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| < 2.5.0 | Chrome ≥ 64                                                                                | Edge ≥ 79                                                                        | Firefox ≥ 78                                                                                   | Safari ≥ 12                                                                                |
| 2.5.0 + | Chrome ≥ 85                                                                                | Edge ≥ 85                                                                        | Firefox ≥ 79                                                                                   | Safari ≥ 14.1                                                                              |

### Sass

Version `2.8.5` and later, the minimum compatible version of Sass is `1.79.0`.

If your terminal prompts `legacy JS API Deprecation Warning`, you can configure the following code in vite.config.ts.

```ts{3}
css: {
  preprocessorOptions: {
    scss: { api: 'modern-compiler' },
  }
}
```

### Version

Element Plus is currently in a rapid development iteration. ![ElementPlus version badge](https://img.shields.io/npm/v/element-plus.svg?style=flat-square)

In addition, every commit and PR on the dev branch will be published to pkg.pr.new, if you want to use some unpublished content, you can refer to here.

## Using Package Manager

**We recommend using the package manager (NPM, Yarn, pnpm) to install Element Plus**,
so that you can utilize bundlers like Vite and
webpack.

Choose a package manager you like.

::: code-group

```shell [npm]
$ npm install element-plus --save
```

```shell [yarn]
$ yarn add element-plus
```

```shell [pnpm]
$ pnpm install element-plus
```

:::

If your network environment is not good, it is recommended to use a mirror registry cnpm or npmmirror.

```shell
npm config set registry https://registry.npmmirror.com
```

## Import in Browser

Import Element Plus through browser HTML tags directly, and use global variable `ElementPlus`.

According to different CDN providers, there are different introduction methods.
Here we use unpkg and jsDelivr as example.
You can also use other CDN providers.

### unpkg

```html
<head>
  <!-- Import style -->
  <link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" />
  <!-- Import Vue 3 -->
  <script src="//unpkg.com/vue@3"></script>
  <!-- Import component library -->
  <script src="//unpkg.com/element-plus"></script>
</head>
```

### jsDelivr

```html
<head>
  <!-- Import style -->
  <link
    rel="stylesheet"
    href="//cdn.jsdelivr.net/npm/element-plus/dist/index.css"
  />
  <!-- Import Vue 3 -->
  <script src="//cdn.jsdelivr.net/npm/vue@3"></script>
  <!-- Import component library -->
  <script src="//cdn.jsdelivr.net/npm/element-plus"></script>
</head>
```

:::tip

We recommend using CDN to import Element Plus users to lock the version
on the link address, so as not to be affected by incompatible updates when Element Plus
is upgraded in the future. Please check unpkg.com for
the method to lock the version.

Due to the limitations of native HTML parsing behavior, single-closed tags may cause some exceptions, so please use double-closed tags, reference

```html
<!-- examples -->
<el-table>
  <el-table-column></el-table-column>
  <el-table-column></el-table-column>
</el-table>
```

:::

## Hello World

With CDN, we can easily use Element Plus to
write a Hello World page. Online Demo

<iframe height="469" style="width: 100%;" scrolling="no" title="YzWMaVr" src="https://codepen.io/iamkun/embed/YzWMaVr?height=469&theme-id=light&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen YzWMaVr by iamkun
  (@iamkun) on CodePen.
</iframe>

If you are installing via package manager and want to use it with
a packaging tool, please read the
next section: Quick Start.
