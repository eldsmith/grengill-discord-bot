<template lang="pug">
    div
        Header
        SearchResults
</template>

<script>
import Vue from "vue";
import Header from "./header";
import SearchResults from "./searchResults";

export default Vue.extend({
  components: {
      Header,
      SearchResults,
  }
});
</script>

<style lang="scss">
@import '../scss/variables';
    body{
        background-color: $backgroundColor;
    }
</style>