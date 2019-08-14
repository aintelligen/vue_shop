<template>
  <div>
    {{listData[0].productName}}
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      listData: {
        type: []
      }
    },
    data() {
      return {
        listData:[]
      };
    }
  };
</script>