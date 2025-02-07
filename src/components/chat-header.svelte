<script>
	import { push, link, location } from "svelte-spa-router";

    export let change_asideOpen;
    export let echo_title;


    const navigateHome = () => {
        push("/"); // 경로 이동
    }
</script>

<header class="easy-header">
    <div class="container">
        <button type="button" class="back" on:click={navigateHome}>
            <i class="icon-back"></i>
        </button>
        <h2>{echo_title}</h2>
        <a use:link href="{$location}/members" class="goto-user"></a>
        <div class="toggle-options">
            <button type="button" on:click={change_asideOpen}>
                <i class="icon-toggle"></i>
            </button>
        </div>
    </div>
</header>

<style>
.easy-header .container h2 {
    font-size: clamp(15px, 2.36vw, 18px);
}
h2 {
    padding-right:30px;
    width: calc(100% - 60px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size:20px;
}
</style>