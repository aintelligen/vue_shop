<template>
  <footer class="footer">
    Copyright © {{Year}} IMooc All Rights Reserved.
  </footer>
</template>

<script>
export default {
  data() {
    return {
      Year: 2019
    };
  },
  mounted() {
    this.Year = new Date().getFullYear();
  }
};
</script>


<style scoped>
.footer {
  text-align: center;
  padding: 40px;
  border-top: 1px solid #ddd;
}
</style>
