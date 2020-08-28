<template>
  <span v-if="date" :class="responsive ? 'timestamp' : ''">
    {{ getTimeSince(date) }}
  </span>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      default: null
    },
    responsive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Gets a date and generates a sentence indicating the amount of time
     * that has passed since that date.
     * TODO: Currently dates are saving several hours ahead of my current time zone.
     * TODO: This should be replaced by a more robust system like moment.js
     */
    getTimeSince(date) {
      const d = new Date(date)
      let seconds = Math.floor((new Date() - d) / 1000)
      let interval = Math.floor(seconds / 31536000)

      if (interval > 1) {
        return interval + ' years'
      }
      interval = Math.floor(seconds / 2592000)
      if (interval > 1) {
        return interval + ' months'
      }
      interval = Math.floor(seconds / 86400)
      if (interval > 1) {
        return interval + ' days'
      }
      interval = Math.floor(seconds / 3600)
      if (interval > 1) {
        return interval + ' hours'
      }
      interval = Math.floor(seconds / 60)
      if (interval > 1) {
        return interval + ' minutes'
      }
      return 'a few seconds'
    }
  }
}
</script>

<style scoped>
.timestamp {
  text-align: right;
}
@media only screen and (max-width: 768px) {
  .timestamp {
    text-align: left;
  }
}
</style>
