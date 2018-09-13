<template>
  <div class="loader">
    <inline-loading/>
    <p>Loading... Please wait...</p>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.loader {
  position: fixed;
  top: 71px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  // background-color: #777;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: -91px;
  p {
    margin-top: 16px;
    font-size: 20px;
    color: #232323;
  }
}
</style>
