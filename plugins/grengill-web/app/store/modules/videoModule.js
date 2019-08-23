export default {
    namespaced: true,
    state: {
        searchResults : {}
    },
    mutations: {
        updateSearch (state, newResult){
            state.searchResults = newResult;
        }
    },
    actions: {
        async searchYoutube({ commit }, query) {
            const testSearch = await fetch(`/search?q=${query}`, {method: 'GET'});
            commit('updateSearch', await testSearch.json());
        }
    },
    getters: {
        snippets: ({searchResults}) => {
            const test = [
                {
                    title: "mulan",
                    description: "When the Emperor of China issues a decree that one man per family must serve in the Imperial Army to defend the country from Northern invaders, Hua Mulan, ...",
                    duration: "01:30",
                    publishedAt: "2019-07-07T16:02:17.000Z",
                    thumbnails: {
                        default: {url : "https://i.ytimg.com/vi/01ON04GCwKs/default.jpg"},
                        high: {url : "https://i.ytimg.com/vi/01ON04GCwKs/hqdefault.jpg"},
                        medium: {url: "https://i.ytimg.com/vi/01ON04GCwKs/mqdefault.jpg"},
                    }
                }
            ]
            if(searchResults.items){
                return searchResults.items.map(item => item.snippet);
            }
            return test;
        }
    }
}