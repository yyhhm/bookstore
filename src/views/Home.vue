<template>
    <div class="home">
        <Nav></Nav>
        <div>
            <SearchBox></SearchBox>
            <Header></Header>
            <router-view></router-view>
        </div>
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
<style scoped lang="less">
.home {
    width: 100%;
    margin-bottom: 30px;
    > div {
        margin: 0 60px;
        background-color: white;
    }
}
</style>
