<!-- 채팅창 더보기 메뉴 -->
 <script>
	import { fly } from 'svelte/transition';
	import { loginOn, userInfo } from '../store/authSlice';
	import { modal_dialog_list } from '../store/modalSlice';
	import { isTest } from '../lib/env';
	import { get_loginType } from '../lib/local_store';

    export let asideOpen;
    export let change_asideOpen;

    // 메뉴 바깥 쪽 클릭 시 끄기
    let nav_container = null;
    const outside_click = (e) => {
        if(nav_container.contains(e.target)) return;
        change_asideOpen();
    }

 </script>

{#if asideOpen}
<aside class="nav active" on:click={outside_click}>
    <div class="nav-container" bind:this={nav_container} transition:fly={{ x:'100%' }}>
        <header>
            <!-- class="on" check이미지 -->
            <h2>
                {#if isTest()}
                SNS알림설정
                {/if}
            </h2>
            <button class="close" on:click={change_asideOpen}></button>
        </header>

        <div class="nav-menu">
            {#if get_loginType() == 'valley'}
            <a href="https://mangrove-porpoise-528.notion.site/18bcba7f51b0806499b5d2668a5c9496?pvs=4" target="_blank">
                <span>업데이트 내역</span><i></i>
            </a>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfULIlemFIYvfAP4JvMD9AKqwK1o3kswqUVFQypg_UlAMSTTg/viewform" target="_blank">
                <span>요청/건의</span><i></i>
            </a>
            {/if}
            {#if $modal_dialog_list && get_loginType() == 'ridge'}
            <a href="#"><span>계정설정</span><i></i></a>
            {/if}
        </div>

        <button type="button" class="nav-logout" on:click={() => loginOn.logout(get_loginType())}><i></i>로그아웃</button>
    </div>
</aside>
{/if}

<style>
aside {
    left:auto;
}
</style>