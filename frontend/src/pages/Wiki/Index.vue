<template>
  <q-page>
    <div class="container">
      <q-tabs>
        <q-route-tab v-for="interceptor in interceptorList"
                     :key="interceptor.name"
                     :label="interceptor.title"
                     :to="interceptor.name"/>
      </q-tabs>
      <div class="q-mt-md">
        <router-view />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import WikiAPI from '../../lib/api/Wiki';

export default defineComponent({
  name: 'WikiIndex',
  setup() {
    const interceptorList = ref<{ name: string, title: string, alias: string[] }[]>();
    return {
      interceptorList
    }
  },
  async mounted() {
    this.interceptorList = await WikiAPI.readme();
    if ((!this.$route.params.name || !this.interceptorList.map(i => i.name).includes(this.$route.params.name as string)) && this.interceptorList.length)
      await this.$router.push(`/${this.$route.params.id as string}/wiki/${this.interceptorList[0].name}`);
  }
})
</script>

<style scoped>

</style>
