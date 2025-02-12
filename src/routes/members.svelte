<!-- 채팅 참여인력 -->
<script>
	import { onMount, setContext } from "svelte";
	import AddHeader from "../components/add-header.svelte";
	import ChatAside from "../components/chat-aside.svelte";
	import { addService } from "../api";

    export let params = {};
    setContext('echo_id', params.echo_id);

    /* 메뉴바 ========================================> */
    let asideOpen = false; // 메뉴바 오픈
    const change_asideOpen = () => asideOpen = !asideOpen;
    
    /* 참여인력 가져오기 ================================> */
    let group_obj = {};
    const init = async () => {
        await addService.get_group({
            echo_id: params.echo_id
        }).then((data) => {
            data.group_list.map((v) => {
                if(!group_obj[v.role]) {
                    group_obj[v.role] = [v];
                } else {
                    group_obj[v.role].push(v);
                }
            });
            group_obj = group_obj;
        });
    }

    onMount(() => {
        init();
    });
</script>

<div id="members">
    <AddHeader title={"참여인력"} {change_asideOpen} />
    <div class="main-content">
        <div class="container">
            <div class="members">
                {#each Object.entries(group_obj) as [role, members]}
                <div class="member-group">
                    <div class="member-cate">{role}</div>
                    <div class="list">
                        {#each members as member, index}
                        <div class="member">
                            <div class="member-name"><b>{member.name || ""}</b>{member.position || ""}</div>
                            <div class="member-tel">
                                {#if member.phone}
                                <a href={`tel:${member.phone}`}>{member.phone}</a>
                                {/if}
                            </div>
                        </div>
                        {/each}
                    </div>
                </div>
                {/each}
                <!-- <div class="member-group">
                    <div class="member-cate">AM</div>
                    <div class="list">
                        <div class="member">
                            <div class="member-name"><b>홍길동</b>대리</div>
                            <div class="member-tel">
                                <a href="tel:010-1111-1111">010-0111-1111</a>
                            </div>
                        </div>
                        <div class="member">
                            <div class="member-name"><b>홍길동</b>대리</div>
                            <div class="member-tel">
                                <a href="tel:010-1111-1111">010-0111-1111</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="member-group">
                    <div class="member-cate">개발</div>
                    <div class="list">
                        <div class="member">
                            <div class="member-name"><b>홍길동</b>대리</div>
                            <div class="member-tel">
                                <a href="tel:010-1111-1111">010-0111-1111</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="member-group">
                    <div class="member-cate">운영</div>
                    <div class="list">
                        <div class="member">
                            <div class="member-name"><b>홍길동</b>대리</div>
                            <div class="member-tel">
                                <a href="tel:010-1111-1111">010-0111-1111</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="member-group">
                    <div class="member-cate">진행</div>
                    <div class="list">
                        <div class="member">
                            <div class="member-name"><b>홍길동</b>대리</div>
                            <div class="member-tel">
                                <a href="tel:010-1111-1111">010-0111-1111</a>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>

    <ChatAside {asideOpen} on:change_asideOpen={change_asideOpen}
        echo_id={params.echo_id} echostep=0/>
</div>

<style></style>