<template lang="pug">
    form(v-on:submit.prevent="search")
        input.search-bar(ref="query")
</template>

<script>
import {mapActions} from 'vuex';

export default {
    methods: {
        search(){
            const q = this.$refs.query.value;
            this.searchYoutube(q);
            this.$refs.query.value = "";
        },

        ...mapActions('videoModule', [
            'searchYoutube'
        ])
    }    
}
</script>

<style lang="scss" scoped>
@import "../scss/variables";
    .search-bar{
        border-radius: 35px;
        border: 1px solid #888;
        box-shadow: inset 1px 1px 5px #bbb;
        background-color: rgba(0,0,0,0);
        padding: 0.3rem 1rem;
        width: 100%;
        height: 1.5rem;
    }
</style>