<!-- 채팅 채팅방 메뉴 -->
<script>
	import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
	import { location, push, querystring } from 'svelte-spa-router';
	import { get_echo_record, set_echo_nav_last_scroll } from '../lib/local_store';
	import { isTest, testlog } from '../lib/env';

    export let echo_id;
    export let chatroom_list;
    const dispatch = createEventDispatcher();

    $: cur_echostep = new URLSearchParams($querystring).get('echostep');
    const go_otherChat = (echostep) => {
        dispatch('store_scroll_position');
        push(`${$location}?echostep=${echostep}`);
    }

    let nav_touch = false; // nav touch될때
    // 
    let nav_this = null;
    let nav_scrollLeft = 0;
    let chatroom_list_length = 0;
    $:if(nav_this && chatroom_list_length != chatroom_list.length) {
        chatroom_list_length = chatroom_list.length;
        chatroom_list_change();
    }
    // nav 스크롤위치 세팅
    export const set_nav_scrollLeft = async () => {
        await tick();
        const echo_record = get_echo_record(echo_id);
        testlog("스크롤위치 세팅" + echo_record.nav_last_scroll);
        nav_this.scrollLeft = echo_record.nav_last_scroll;
    }
    const chatroom_list_change = () => {
        set_nav_scrollLeft();
        nav_this.removeEventListener('scroll', nav_scroll_event);
        nav_this.addEventListener('scroll', nav_scroll_event);
    }
    const nav_scroll_event = (e) => {
        let scrLeft = e.target.scrollLeft;
        // nav 스크롤 따로 저장
        nav_scrollLeft = scrLeft;
    }

    onDestroy(() => {
        set_echo_nav_last_scroll(echo_id, nav_scrollLeft);
    });

</script>

<nav bind:this={nav_this} on:touchstart={() => nav_touch = true}
    on:touchend={() => nav_touch = false}
    on:touchcancel={() => nav_touch = false}
    class:touch={nav_touch}>
    <div class="btn-group">
        {#each chatroom_list as chatroom}
        <button type="button" class="btn" 
            class:active={cur_echostep == chatroom.echostep}
             on:click={() => go_otherChat(chatroom.echostep)}>
            <strong>{chatroom.name}</strong>
            {#if chatroom.customer_unread || chatroom.my_unread}
            <div class="count">
                {#if chatroom.customer_unread}
                <span class="text-red">{chatroom.customer_unread > 99 ? "99+" : chatroom.customer_unread}</span>
                {/if}
                {#if chatroom.my_unread}
                <span class="text-green">{chatroom.my_unread > 99 ? "99+" : chatroom.my_unread}</span>
                {/if}
            </div>
            {/if}
        </button>
        {/each}
    </div>
</nav>

<style>
nav {
    position:relative;
    width:100%;
    height:74px;
    overflow-x: scroll;
}
.btn-group {
    display: flex;
    grid-gap: 0;
    position:absolute;
    z-index:1;
    background-color: #fff;
    height:72px;
}
.btn-group .btn {
    width: calc(100vw / 6 + 31px);
    margin-right: 5px;
    /* padding:0 10px; */
    /* min-width:65px; */
}
.btn-group .btn strong, .btn-group .btn .count {
    /* white-space: nowrap; */
}
.theme-valley .btn-group .btn.active {
    background: linear-gradient(to right, #4fc36e, #03ac78);
}
.btn-group .btn .count {
    padding: 0 6px;
}
.btn-group .btn .count span {
    width: auto;
}
/* 스크롤 */
nav::-webkit-scrollbar {
	width: 1px;
	height: 2px;
}
nav::-webkit-scrollbar-thumb {
	background-color: rgb(149, 165, 190);
    visibility: hidden;
}
nav.touch::-webkit-scrollbar-thumb {
    visibility: visible;   
}
nav::-webkit-scrollbar-track {
	background-color: #eaeaea;
	border-left: 1px solid #ccc;
}
</style>