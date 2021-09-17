<template>
  <q-item clickable tag="a" @click="goto">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption v-if="caption">
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },
    caption: {
      type: String
    },
    link: {
      type: String,
      default: '/'
    },
    icon: {
      type: String,
      default: ''
    }
  },
  methods: {
    goto() {
      this.$router.push(this.link).catch(() => void 0);
    }
  }
})
</script>
