<template>
  <q-page>
    <q-parallax>
      <q-parallax>
        <template v-slot:content="scope">
          <div class="absolute column items-center"
               :style="{
               opacity: 0.35 + (1 - scope.percentScrolled) * 0.65,
               top: (scope.percentScrolled * 1) + '%',
               left: 0,
               right: 0
             }">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div style="margin: 0 auto; width: 100%; max-width: 240px">
                  <div>
                    <img src="img/logo.webp" style="width: 100%" />
                  </div>
                </div>
              </div>
              <div class="col-12 text-h4 text-bold text-center">
                二师兄后花园
              </div>
            </div>
          </div>
        </template>
      </q-parallax>
    </q-parallax>
    <div class="container">
      <markdown-player :content="readme" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MarkdownPlayer from 'components/MarkdownPlayer.vue';

export default defineComponent({
  name: 'PageIndex',
  components: {MarkdownPlayer},
  setup() {
    const readme = ref<string>();
    return { readme };
  },
  mounted() {
    return void 0
  }
});
</script>
