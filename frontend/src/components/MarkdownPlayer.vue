<template>
  <div ref="md" class="markdown-body" v-html="html"></div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import { Converter } from 'showdown';
import hljs from 'highlight.js';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github.css';

const converter: Converter = new Converter({
  rawPrefixHeaderId: true,
  excludeTrailingPunctuationFromURLs: true,
  tables: true,
  emoji: true
});
converter.setFlavor('github');

export default defineComponent({
  name: 'MarkdownPlayer',
  props: {
    content: {
      type: String
    }
  },
  watch: {
    html() {
      const el = this.$refs.md as HTMLElement;
      if (el) {
        const blocks = el.querySelectorAll('pre code');
        blocks.forEach(block => {
          hljs.highlightBlock(block as HTMLElement)
        })
      }
    }
  },
  computed: {
    html(): string {
      if (!this.content) return '';
      return converter.makeHtml(this.content);
    }
  }
})
</script>

<style scoped>

</style>
