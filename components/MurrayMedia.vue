<template>
  <div
    class="murray-media"
  >
    <div
      :style="backgroundStyle"
      class="murray-media__inner"
    />
  </div>
</template>

<style lang="scss">
.murray-media {
  &__inner {
    background-size:cover;
    padding-top:100%;
    width:100%;
  }
}
</style>

<script>
  export default {
    name: 'MurrayMedia',
    props: {
      seed: {
        type: Number,
        required: true,
      }
    },
    computed: {
      backgroundStyle() {
        return {
          backgroundImage: `url('https://www.fillmurray.com/500/50${this.seed}')`,
        }
      }
    }
  }
</script>
