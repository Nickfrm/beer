<template>
  <select v-model="valueBuffer">
    <option value="">{{none}}</option>
    <option v-for="i in itemsParsed" :value="i.id" :key="i.id">{{i.name}}</option>
  </select>
</template>


<script>
export default {
  name: 'custom-select',
  props: {
    value: {
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    none: {
      type: String,
      default: 'Please, choose'
    }
  },
  computed: {
    itemsParsed() {
      if (!this.items[0] || this.items[0].id) return this.items
      return this.items.map(e => {
        return {
          id: e,
          name: e
        }
      })
    },
    valueBuffer: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  }
}
</script>
