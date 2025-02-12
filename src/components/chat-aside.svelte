<!-- 채팅창 더보기 메뉴 -->
 <script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { link, location } from 'svelte-spa-router';
	import { fly, slide } from 'svelte/transition';
	import { loginOn, userInfo } from '../store/authSlice';
	import { isTest } from '../lib/env';
	import { addService } from '../api';

    $:userType = $userInfo.type;

    export let echo_id;
    export let asideOpen;
    export let echostep;
    const dispatch = createEventDispatcher();

    // 메뉴 바깥 쪽 클릭 시 끄기
    let nav_container = null;
    const outside_click = (e) => {
        if(nav_container.contains(e.target)) return;
        dispatch('change_asideOpen');
    }

    // 참고문건 열기닫기
    let refer_open = false;

    let get_document_await = null;
    const get_document = () => {
        get_document_await = addService.get_document({
            echo_id, echostep
        }).then((data) => {
            if(data.echo_files.length > 7) {
                data.echo_files = data.echo_files.slice(0, 7);
            }
            return data;
        });
    }

    $:if(echostep) {
        get_document();
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
        <button class="close" on:click={() => dispatch('change_asideOpen')}></button>
        </header>

        <div class="nav-menu">
            <a use:link href="/chat/{echo_id}/needs"><span>니즈모음</span><i></i></a>
            {#if isTest()}
            <a use:link href="/chat/{echo_id}/outline"><span>과정개요</span><i></i></a>
            <a use:link href="/chat/{echo_id}/attach-file"><span>첨부파일</span><i></i></a>
            {:else}
            <a href="#" on:click|preventDefault><span>과정개요(준비중)</span><i></i></a>
            {#await get_document_await then data}
            {#if echostep == 2 || echostep == 64}
            <a class="refer" class:active={refer_open}
                on:click|preventDefault={() => {
                    refer_open = !refer_open;
                }}>
                <span>참고문건({data.echo_files_count > 0 ? `${data.echo_files_count}개` : '없음'})</span>
                {#if data.echo_files_count > 0}
                <i></i>
                {/if}
            </a>
                {#if refer_open && data.echo_files_count > 0}
            <div class="refer-file">
                <div in:slide={{duration:500}} out:slide={{duration:500}}>
                    {#each data.echo_files as echo_file, index}
                    <p>· <a href={echo_file.echo_file_url} download>{echo_file.echo_file_name}</a></p>
                    {/each}
                </div>
            </div>
                {/if}
            {/if}
            {/await}
            {/if}
        </div>

        <button type="button" class="nav-logout" on:click={() => loginOn.logout(userType)}><i></i>로그아웃</button>
    </div>
</aside>
{/if}

<style>
aside {
    left:auto;
}
.nav .nav-menu a.refer {
    background-color: #fff;
}
.nav .nav-menu a.refer.active {
    border-radius: 5px 5px 0 0;
}
.nav .nav-menu a.refer i {
    transition: all 0.5s;
    transform: rotate(90deg);
}
.nav .nav-menu a.refer.active i {
    transform: rotate(-90deg);
}
.refer-file {
    margin-top: -15px;
    border-right: 1px solid #dadcde;
    border-left: 1px solid #dadcde;
    border-bottom: 1px solid #dadcde;
    border-radius: 0 0 5px 5px;
}
.refer-file>div {
    padding: 5px 10px;
}
.refer-file a {
    display: inline;
    background-color: transparent;
    border: none;
    border-radius: 0px;
    padding: 0;
    height: auto;
    font-size: 14px;
    color:rgb(63, 127, 223);
}
.refer-file p {
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
}
.refer-file p:last-child {
    border-bottom: none;
}
.refer-file a:hover, .refer-file a:active {
    text-decoration: underline;
}
</style>