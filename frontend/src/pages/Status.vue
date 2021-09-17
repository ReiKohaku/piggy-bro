<template>
  <q-page>
    <div class="container">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-item>
            <q-item-section side>
              <q-avatar size="64px" v-if="status">
                <q-img :src="status.isLogin ? status.avatar : ''"/>
              </q-avatar>
              <q-skeleton type="QAvatar" v-else/>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="status">{{ status.isLogin ? status.name : '未登录' }}</q-item-label>
              <q-item-label v-else>
                <q-skeleton type="text"/>
              </q-item-label>
              <q-item-label caption v-if="status">{{ startedFor }}</q-item-label>
              <q-item-label v-else>
                <q-skeleton type="text"/>
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-12 text-h6">
          状态查看
        </div>
        <div class="col-12">
          <q-tree :nodes="attributes" node-key="label" no-connectors v-model:expanded="expanded" v-if="status" />
          <q-skeleton type="rect" v-else/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import StatusAPI, {BotStatus} from '../lib/api/Status';
import {humanDateLength} from 'src/lib/util';
import WikiAPI from 'src/lib/api/Wiki';

interface TreeNode {
  label: string
  avatar?: string
  children?: TreeNode[]
}

export default defineComponent({
  name: 'Status',
  setup() {
    const status = ref<BotStatus>();
    const timer = ref<number>();
    const startedFor = ref<string>();
    const expanded = ref([]);
    const interceptorList = ref<{ name: string, title: string, alias: string[] }[]>();
    return {
      status,
      timer,
      startedFor,
      expanded,
      interceptorList
    }
  },
  computed: {
    attributes(): TreeNode[] {
      if (!this.status || !this.status.attributes) return [];
      const nodes: TreeNode[] = [];
      for (const method in this.status.attributes) {
        const interceptorInfo = this.interceptorList ? this.interceptorList[this.interceptorList.map(i => i.name).indexOf(method)] : { name: method, title: undefined }
        const node = {
          label: interceptorInfo.title || interceptorInfo.name,
          children: [] as TreeNode[]
        };
        for (const attr in this.status.attributes[method]) {
          const attrObj = this.status.attributes[method][attr];
          node.children.push({
            label: `${attrObj.desc || attr}: ${attrObj.data.toString()}`
          })
        }
        nodes.push(node);
      }
      return nodes;
    }
  },
  async mounted() {
    this.interceptorList = await WikiAPI.readme();
    this.status = await StatusAPI.status(this.$route.params.id as string);
    const startAt = new Date(this.status.startAt);
    if (!this.timer) this.timer = window.setInterval(() => {
      this.startedFor = `已启动 ${humanDateLength(Math.floor((new Date().getTime() - startAt.getTime()) / 1000))}`
    }, 200);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
})
</script>

<style scoped>

</style>
