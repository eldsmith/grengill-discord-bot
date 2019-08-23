<template lang="pug">
    .search-result-video
        img(:src="snippet.thumbnails.default.url")
        h1 {{snippet.title}}

</template>

<script>
export default {
    props: ["snippet"]
}
</script>

<style lang="scss" scoped>
@import "../scss/variables";

    .search-result-video {
        display: flex;

        width: 100%;
        padding: 1rem;
        margin: 1rem 0;

        background-color: $secondaryColor;
        box-shadow: 2px 1px 5px 3px darken($backgroundColor, 10);
        border-radius: 5px;
        h1 {
            font-size: 1.4rem;
            font-weight: normal;
        }
    }
</style>