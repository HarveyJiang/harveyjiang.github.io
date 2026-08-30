import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://harveyjiang.github.io/",
    title: "Harvey",
    description: "工程师的笔记、工具与折腾记录。覆盖基础设施、自动化、1Panel、Cloudflare 等。",
    author: "Harvey",
    profile: "https://github.com/HarveyJiang",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
      url: "",
      static_url: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/HarveyJiang" },
    { name: "mail",     url: "mailto:harveyjiang@foxmail.com" },
  ],
  shareLinks: [
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
