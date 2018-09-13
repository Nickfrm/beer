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
  font-size: 15px;
  text-transform: uppercase;
  height: 36px;
  line-height: 36px;
  padding: 0 15px;
  transition: 0.3s ease;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: $main;
    border-color: $main;
  }
  &.light {
    color: #858585;
    background-color: $grey;
    border-color: #ccc;
    &:hover {
      background-color: $l-grey;
      color: #444;
    }
  }
  &:disabled {
    color: #bbb;
    background-color: #888;
    border-color: #ccc;
  }
}
</style>
