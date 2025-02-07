<!-- 채팅 채팅방 메뉴 -->
<script>
	import { createEventDispatcher } from 'svelte';
	import { location, push, querystring } from 'svelte-spa-router';

    export let chatroom_list;
    const dispatch = createEventDispatcher();

    $: cur_echostep = new URLSearchParams($querystring).get('echostep');
    const go_otherChat = (echostep) => {
        dispatch('store_scroll_position');
        push(`${$location}?echostep=${echostep}`);
    }

</script>

<nav>
    <div class="btn-group">
        {#each chatroom_list as chatroom}
        <button type="button" class="btn" 
            class:active={cur_echostep == chatroom.echostep}
             on:click={() => go_otherChat(chatroom.echostep)}>
            <strong>{chatroom.name}</strong>
            {#if chatroom.customer_unread || chatroom.my_unread}
            <div class="count">
                <span class="text-red">{chatroom.customer_unread > 99 ? "99+" : chatroom.customer_unread}</span>
                <span class="text-green">{chatroom.my_unread > 99 ? "99+" : chatroom.my_unread}</span>
            </div>
            {/if}
        </button>
        {/each}
    </div>
</nav>

<style>
.theme-valley .btn-group .btn.active {
    background: linear-gradient(to right, #4fc36e, #03ac78);
}
.btn-group .btn .count {
    padding: 0 6px;
}
.btn-group .btn .count span {
    width: auto;
}
</style>