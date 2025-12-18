<script lang="ts" setup>
defineProps<{
  isHome?: boolean
}>()
</script>

<style lang="scss">
.dark .footer {
  background-color: var(--el-fill-color-lighter);
}
.footer {
  background-color: #f5f7fa;
  box-sizing: border-box;
  padding: 42px 64px 64px;

  &.is-home {
    background-color: var(--bg-color);
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 0;
  }

  .container {
    box-sizing: border-box;
    width: auto;
  }

  .footer-main {
    font-size: 0;
    display: inline-block;
    vertical-align: top;
    margin-right: 130px;

    h4 {
      font-size: 18px;
      line-height: 1;
      margin: 0 0 15px;
      font-weight: 400;
      color: var(--el-text-color-primary);
    }

    .footer-main-link {
      display: block;
      margin: 0;
      line-height: 2;
      font-size: 14px;
      color: var(--text-color-light);

      &:hover {
        color: var(--text-color);
      }
    }
  }

  .footer-social {
    float: right;
    text-align: right;

    .footer-social-title {
      color: var(--text-color-light);
      font-size: 18px;
      line-height: 1;
      margin: 0 0 20px;
      padding: 0;
      font-weight: bold;
    }

    .ep-icon-github {
      transition: 0.3s;
      display: inline-block;
      line-height: 32px;
      text-align: center;
      color: #c8d6e8;
      background-color: transparent;
      font-size: 32px;
      vertical-align: middle;
      margin-right: 20px;
      &:hover {
        transform: scale(1.2);
        color: #8d99ab;
      }
    }

    .doc-icon-gitter {
      margin-right: 0;
    }
  }
}

@media (max-width: 1140px) {
  .footer {
    height: auto;
  }
}

@media (max-width: 1000px) {
  .footer-social {
    display: none;
  }
}

@media (max-width: 768px) {
  .footer {
    .footer-main {
      margin-bottom: 30px;
    }
  }
}
</style>
