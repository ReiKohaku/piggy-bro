<template>
  <markdown-player :content="content" v-if="!loading && !error && content && content.length" />
  <div v-else-if="loading && !error">
    <div class="row q-gutter-sm items-center justify-center text-center">
      <q-spinner size="xs" />
      <div class="text-caption text-grey">加载中，请稍候……</div>
    </div>
  </div>
  <div v-else-if="error">
    <div class="row q-gutter-sm items-center justify-center text-center">
      <div class="text-caption text-grey">出错啦！请联系二师兄管理员解决吧？</div>
    </div>
  </div>
  <div v-else>
    <div class="row q-gutter-sm items-center justify-center text-center">
      <div class="text-caption text-grey">这个功能没有任何说明。</div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import WikiAPI from '../../lib/api/Wiki';
import MarkdownPlayer from 'components/MarkdownPlayer.vue';

export default defineComponent({
  name: 'Wiki',
  components: {MarkdownPlayer},
  setup() {
    const content = ref<string>();
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    return {
      content,
      loading,
      error
    }
  },
  watch: {
    name: {
      async handler(val: string) {
        this.loading = true;
        this.error = false;
        try {
          this.content = await WikiAPI.readme(val);
        } catch {
          this.error = true;
        } finally {
          this.loading = false;
        }
      },
      immediate: true
    }
  },
  computed: {
    name(): string {
      return this.$route.params.name as string;
    }
  }
})
</script>

<style scoped>

</style>
