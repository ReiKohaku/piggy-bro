<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer"/>

        <q-toolbar-title>
          二师兄后花园
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          功能列表
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link"/>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  computed: {
    essentialLinks() {
      return [
        {
          title: '主页',
          caption: '后花园主页',
          icon: 'home',
          link: `/${this.$route.params.id as string}`
        },
        {
          title: 'Wiki',
          caption: '二师兄的使用帮助',
          icon: 'book',
          link: `/${this.$route.params.id as string}/wiki`
        },
        {
          title: '状态',
          caption: '二师兄的运行状态',
          icon: 'visibility',
          link: `/${this.$route.params.id as string}/status`
        }
      ]
    }
  }
})
</script>
