<template>
  <div
    class="md-modal-box"
    v-bind:class="{'md-show':mdShow}"
  >
    <div class="md-wrap">
      <div
        class="md-modal modal-msg md-modal-transition"
        v-bind:class="{'md-show':mdShow}"
      >

        <div class="md-modal-inner">
          <div class="md-top">
            <button
              class="md-close"
              @click="closeMoadl"
            ><img
                src="/static/close.png"
                alt=""
              ></button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <slot name="message"></slot>
            </div>
            <div class="btn-wrap">
              <slot name="btnGroup"></slot>
            </div>
          </div>
        </div>
      </div>
      <div
        class="md-overlay"
        v-if="mdShow"
        @click="closeMoadl"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mdShow"],
  data() {
    return {
      msg: "App"
    };
  },
  methods: {
    closeMoadl() {
      this.$emit("close");
    }
  }
};
</script>


<style>
</style>
