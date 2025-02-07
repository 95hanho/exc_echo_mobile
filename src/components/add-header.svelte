<!-- 더보기 헤더 -->
<script>
	import { getContext } from "svelte";
	import { push } from "svelte-spa-router";

    const echo_id = getContext('echo_id');

    export let title;
    export let change_asideOpen;

</script>

<header class="easy-header">
    <div class="container">
        <button type="button" class="back" on:click={() => push(`/chat/${echo_id}`)}>
            <i class="icon-back"></i>
        </button>

        <h2>{title}</h2>

        <div class="toggle-options">
            <button type="button" on:click={change_asideOpen}>
                <i class="icon-toggle"></i>
            </button>
        </div>
    </div>
</header>

<style></style>