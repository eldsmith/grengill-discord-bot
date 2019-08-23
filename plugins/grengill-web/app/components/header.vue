<template lang="pug">
    .header
        p GrengilBot - Powered by Friendship
        Search.search
</template>

<script>
import Search from './search';
import Vue from 'vue';
import { mapState } from 'vuex'

export default Vue.extend({
    components: {
        Search
    },
    computed: mapState({
        searchResults: state => state.videoModule.searchResults
    })
  })
</script>

<style lang="scss" scoped>
@import '../scss/variables';
@import '../scss/breakpoints';


    .header {
        width: 100%;
        min-height: 130px;
        max-height: 200px;
        height: 25vh;
        background-color: $headerColor;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    
    .search{
        width: 80%;
        @include sm{
            width: 65%;
        }
        @include md {
            width: 50%;
        }
    }
</style>