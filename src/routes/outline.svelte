<!-- 채팅창 더보기 - 과정개요 -->
<script>
	import { onMount, setContext } from "svelte";
	import AddHeader from "../components/add-header.svelte";
	import ChatAside from "../components/chat-aside.svelte";
	import { addService } from "../api";

    export let params = {};
    setContext('echo_id', params.echo_id);

    let asideOpen = false;
    const change_asideOpen = () => asideOpen = !asideOpen;


    let get_outline_await = null;
    const init = async () => {
        get_outline_await = await addService.get_outline({
            echo_id: params.echo_id,
        }).then((data) => {
            console.log(data);
            return data.outline;
        });
    }
    onMount(() => {
        init();
    });

</script>

<div id="outline">
    <AddHeader title={"과정 개요"} {change_asideOpen}/>

    <div class="main-content">
        <div class="container">
            {#await get_outline_await then data}
            {#if data}
            <div class="overview">
                <article class="article">
                        <div class="block">
                            <h3 class="cont-title">교육과정명</h3>
                            <div><b>{data.echo_name}</b></div>
                        </div>
                        <div class="block">
                            <h3 class="cont-title">교육목적</h3>
                            <div>{@html data.echo_purpose.replace(/\r\n/g, "").replace(/(<br\s*\/?>){3,}/g, '<br><br>')}</div>
                        </div>
                        <div class="block">
                            <h3 class="cont-title">교육형태</h3>
                            <div>{data.echo_type}</div>
                        </div>
                        <div class="block">
                            <h3 class="cont-title">관련정보</h3>
                            {#each data.related_info_list as info, index}
                            <div>
                                <b>·{info.item}</b>
                                <p>{@html info.content.replace(/\r\n/g, "").replace(/(<br\s*\/?>){3,}/g, '<br><br>')}</p>
                            </div>
                            {/each}
                        </div>
                </article>

                <article class="article">
                    <div class="block">
                        <h3 class="cont-title">교육일정</h3>
                        <div class="table table-striped">
                            <table>
                                <tbody>
                                    {#each data.schedule_list as schedule, index}
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{schedule.program_name}</td>
                                        <td>{schedule.schedule}</td>
                                    </tr>
                                    {/each}
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                </article>
            </div>
            {/if}
            {/await}
        </div>
    </div>

    <ChatAside {asideOpen} on:change_asideOpen={change_asideOpen} echo_id={params.echo_id}
        echostep=0 />
</div>

<style>
#outline .main-content {
    padding-top:0;
    padding-bottom:40px;
}
.overview .block div b + p {
    padding-bottom: 15px;
}
</style>