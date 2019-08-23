<template lang="pug">
    #search-results
        SearchResultVideo(v-for="snippet in snippets" :snippet="snippet")
        div {{logSnippets()}}
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import SearchResultVideo from './searchResultVideo';

export default {
    components: {
        SearchResultVideo
    },
    computed: {
        ...mapGetters({
            snippets: 'videoModule/snippets'
        }),
        ...mapState({
            searchResults: state => state.videoModule.searchResults
        })
    },
    methods: {
        logSnippets(){
            console.log(this.snippets);
        }
    } 
}
</script>

<style lang="scss" scoped>
@import "../scss/breakpoints";

    #search-results{
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        margin-top: 4rem;

        width: 50%;
    }
</style>
