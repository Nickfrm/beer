<template>
  <div class="loader">
    <font-awesome-icon icon="spinner" spin size="3x" />
    <p>Loading... Please wait...</p>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.loader {
  position: fixed;
  top: 51px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  // background-color: #777;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .fa-spinner {
    color: #232323;
  }
  p {
    margin-top: 30px;
    font-size: 24px;
    color: #232323;
  }
}
</style>
