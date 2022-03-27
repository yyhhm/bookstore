<template>
    <div class="home">
        <Nav></Nav>
        <SearchBox></SearchBox>
        <Header></Header>

        <router-view></router-view>
    </div>
</template>

<script>
import Header from '../components/Header.vue'
import Nav from '../components/Nav.vue'
import SearchBox from '../components/SearchBox.vue'

export default {
    name: 'Home',
    components: {
        Header,
        Nav,
        SearchBox,
    },
    data() {
        return {}
    },
}
</script>
<style>
.home {
    width: 100%;
}
</style>
