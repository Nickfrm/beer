<template>
  <button class="link">
    <slot/>
  </button>
</template>
<script>
export default {
  name: 'custom-button',
  data() {
    return {}
  },
  props: {}
}
</script>
<style lang="scss">
@import '~styles/variables';
.link {
  color: $l-main;
  background-color: transparent;
  border: none;
  font-size: 14px;
  display: inline;
  transition: 0.3s ease;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: $main;
  }
}
</style>
