<script>
	import { link } from 'svelte-spa-router';

    export let change_asideOpen;
</script>

<header class="header">
    <div class="container">
        <h1 class="logo">
            <a use:link href="/" title="홈 바로가기">echo ridge</a>
            <button type="button" class="h-logout" on:click={change_asideOpen}><i class="icon-toggle main"></i></button>
            <!-- <button type="button" on:click={change_asideOpen}>
                <i class="icon-toggle"></i>
            </button> -->
        </h1>
    </div>
</header>

<style>
.theme-tree .header .logo a {
    width: 145px;
}
.h-logout {
    right: var(--vh);
    background-image: none;
}
.icon-toggle.main {
    background-image: url('/template/img/toggle_bl.png');
}
</style>