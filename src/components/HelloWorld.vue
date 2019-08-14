<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <child :num="num" v-on:incremt="increment" v-on:decremt="decrement"></child>
    <span>parent:{{num}}</span>  
  </div>
</template>

<script>
import child from './child'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      num: 10
    }
  },
  components: {
    child
  },
  methods: {
    increment () {
      this.num++
    },
    decrement () {
      this.num--
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
