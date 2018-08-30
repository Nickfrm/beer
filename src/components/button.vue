<template>
  <button :disabled="disabled">
    <slot/>
  </button>
</template>
<script>
export default {
  name: 'custom-button',
  data() {
    return {}
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
