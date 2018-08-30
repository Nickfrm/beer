<template>
  <button :disabled="disabled" class="btn-cta">
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
<style lang="scss">
@import '~styles/variables';
.btn-cta {
  background-color: $l-main;
  color: #fff;
  border: 1px solid $l-main;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  height: 28px;
  line-height: 28px;
  padding: 0 15px;
  transition: 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: $main;
    border-color: $main;
  }
}
</style>
