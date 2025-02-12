<!-- 채팅창 더보기 - 니즈 -->
<script>
	import { replace } from 'svelte-spa-router';
	import { onMount, setContext } from "svelte";
	import AddHeader from "../components/add-header.svelte";
	import ChatAside from "../components/chat-aside.svelte";
	import { addService } from "../api";

    export let params = {};
    setContext('echo_id', params.echo_id);

    let asideOpen = false;
    const change_asideOpen = () => asideOpen = !asideOpen;
    
    let echostep = 0;
    let get_needs_await = null;
    const init = async () => {
        get_needs_await = await addService.get_needs({
            echo_id: params.echo_id,
            echostep
        }).then((data) => {
            return data;
        });
    }
    onMount(() => {
        let echo_record = JSON.parse(localStorage.getItem('echo_record')) || {}
        echostep = echo_record[params.echo_id] || 2;
        init();
    });

</script>

<div id="needs">
    <AddHeader title={"니즈 모음"} {change_asideOpen}/>
    <div class="main-content">
        <div class="container">
            <div class="overview">
                {#await get_needs_await then needs}
                {#if needs}
                <article class="article">
                    {#if needs.normal_need_list}
                    <div class="block">
                        <h3 class="cont-title">일반니즈</h3>
                        <div>
                            <!-- <b>·{normal.title}</b> -->
                            <p>{@html needs.normal_need_list.replace(/\n/g, "<br />")}</p>
                        </div>
                    </div>
                    {/if}
                    <!-- {#each needs.normal_need_list as normal, index}
                    <div class="block">
                        {#if index == 0}
                        <h3 class="cont-title">일반니즈</h3>
                        {/if}
                        <div>
                            <b>·{normal.title}</b>
                            <p>{@html normal.content.replace('\n', "<br />")}</p>
                        </div>
                    </div>
                    {/each} -->
                </article>
                <article class="article">
                    {#each needs.relation_need_list as relation, index}
                    <div class="block">
                        {#if index == 0}
                        <h3 class="cont-title">교육일정</h3>
                        {/if}
                        <div>
                            <b>·{relation.title}</b>
                            <p>{@html relation.content}</p>
                        </div>
                    </div>
                    {/each}
                </article>
                {/if}
                {/await}
                <!-- <article class="article">
                    <div class="block">
                        <h3 class="cont-title">일반니즈</h3>
                        <div>
                            <b>·고객사 소개</b>
                            <p>담당자가 원하는 그림은 심플하고 임팩트있게 해달라는
                                부분입니다! (아래의 사이트 배너 처럼 나오면 될거 같아요)
                                https://www.metab.co.kr/?gclid=EAIaIQobChMIi-K-v
                                O69gIVDVdgCh1fWQZpEAAYASAAEgLvPvD_BwE
                                배경으로 들어간 이미지(교육 또는 리더십 관련 이미지)는 </p>
                        </div>
                    </div>
                    <div class="block">
                        <div>
                            <b>·최근 조직 이슈</b>
                            <p>담당자가 원하는 그림은 심플하고 임팩트있게 해달라는
                                부분입니다! (아래의 사이트 배너 처럼 나오면 될거 같아요)
                                https://www.metab.co.kr/?gclid=EAIaIQobChMIi-K-v
                                O69gIVDVdgCh1fWQZpEAAYASAAEgLvPvD_BwE
                                배경으로 들어간 이미지(교육 또는 리더십 관련 이미지)는 </p>
                        </div>
                    </div>
                </article>
                <article class="article">
                    <div class="block">
                        <h3 class="cont-title">교육일정</h3>
                        <div>
                            <b>·강사에게 주요내용</b>
                            <p>담당자가 원하는 그림은 심플하고 임팩트있게 해달라는 
                                부분입니다! (아래의 사이트 배너 처럼 나오면 될거 같아요) 
                                https://www.metab.co.kr/?gclid=EAIaIQobChMIi-K-v
                                O69gIVDVdgCh1fWQZpEAAYASAAEgLvPvD_BwE
                                배경으로 들어간 이미지(교육 또는 리더십 관련 이미지)는 </p>
                        </div>
                    </div>
                </article> -->
            </div>
        </div>
    </div>

    <ChatAside {asideOpen} on:change_asideOpen={change_asideOpen} echo_id={params.echo_id}
        echostep=0 />
</div>

<style>
#needs .main-content {
    padding-top:0;
    padding-bottom:40px;
}
.article {
    padding: 35px 0 20px;
}
</style>