<script>
	import { createEventDispatcher, onDestroy, onMount, tick } from "svelte";
	import { fade } from "svelte/transition";
	import { isTest } from "../../lib/env";
	import { modal_alert, modal_chatAdd, modal_chatAdd_type } from "../../store/modalSlice";
	import { get_loginType } from "../../lib/local_store";
	import { chatService } from "../../api";
    import moment from "moment/moment";
	import { userInfo } from "../../store/authSlice";
	import { chat_scroll_near_last, scroll_move_last } from "../../lib/ui";

    export let bottom_btn_on;
    export let readend_chat;
    export let chatWrap_ele;
    export let response_open;
    export let response_chat;
    export let echo_id;
    export let echostep;
    export let chat_list;
    export let read_ele;
    const dispatch = createEventDispatcher();

    // 메시지 입력
    let chat_txt = ""; // 입력텍스트
    let fileEle = null; // 파일입력ELe
    let chat_file = null; // 파일
    export const reset_chat_file = () => chat_file = null;
    let request_message = false; // 확인요청메시지인지
    export const reset_request_message = () => request_message = false;
    // 채팅 줄바꿈에 따라 rows 조절(최대 4)
    let chat_row = 1;
    $: if((chat_txt.match(/\n/g) || []).length > -1) {
        let row = 1 + (chat_txt.match(/\n/g) || []).length;
        chat_row = row > 4 ? 4 : row;
    }
    let replyContainer_ele = null; // 답장 element
    let replyContainer_ele2 = null; // 파일 element
    $:if(chat_row || !response_open || replyContainer_ele || replyContainer_ele2 || chat_file) {
        change_chatWrap_calc_height();
    }
    // 채팅입력 높이에 따라 채팅리스트창 높이조절
    const change_chatWrap_calc_height = async () => {
        await tick();
        let reply_height = replyContainer_ele ? replyContainer_ele.clientHeight : 0; // 답장 높이이
        reply_height = replyContainer_ele2 ? replyContainer_ele2.clientHeight : reply_height; // 답장 높이이
        let row = chat_row;
        dispatch('change_chatWrap_calc_height', {value:(row - 1) * 12.3 + reply_height});
        // 
        if(chatWrap_ele && chat_scroll_near_last(chatWrap_ele)) {
            if(!read_ele) {
                await tick();
                scroll_move_last(chatWrap_ele);
            }
        }
    }
    // 채팅 추가 팝업 동작
    $:if($modal_chatAdd_type) {
        if($modal_chatAdd_type == 1) {
            // 파일업로드
            fileEle.click();
        } else if($modal_chatAdd_type == 2) {
            // 확인요청메시지
            request_message = true;
        }
        //
        modal_chatAdd_type.set(0);
    }
    let ing_sendChat = false;
    const sendChat = async (e) => {
        // console.log(chat_file);
        // return;
        if(!chat_txt) {
            modal_alert.open("메시지를 입력해주세요.");
            return;
        }
        if(ing_sendChat) return;
        ing_sendChat = true;
        const obj = {echo_id, chat_txt};
        if(get_loginType() != 'tree') {
            obj.echostep = echostep;
        }
        if(response_open) obj.chat_id = response_chat.chat_id;
        await chatService.set_chat(obj).then(async (data) => {
            // console.log(data);
            if(data.latest_chat_list) chat_list.push(...data.latest_chat_list);
            chat_list.push({
                chat_id: data.chat_id,
                content: chat_txt,
                member_no: $userInfo.member_no,
                react_list: [],
                writer: $userInfo.name,
                createdAt: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                respond: obj.chat_id ? {
                    ...response_chat,
                } : false,
            });
            dispatch('change_chat_list', {value:chat_list});
            dispatch('change_levd', {value:new Date()});
            await tick();
            dispatch('scroll_move');
            chat_txt = "";
            dispatch('response_open_false');
            dispatch('response_chat_reset');
        }).catch((err) => {
            modal_alert.open('일시적 오류 발생. <br />다시 시도해주세요.');
        });
        if(response_open) dispatch('response_open_false');
        ing_sendChat = false;
    }
</script>


<!-- 입력창 -->
<div id="chatInput" class="chat-input">
    {#if bottom_btn_on}
        {#if readend_chat}
    <!-- 읽어야하는 마지막 채팅이 있을 때 -->
    <button class="bottom-latest-btn" in:fade={{duration:500}} out:fade={{duration:500}}
        on:click={() => dispatch('scroll_move_last')}>
        <span>
            <b>{readend_chat.writer}{readend_chat.position ? ` ${readend_chat.position}` : ''}</b>: {readend_chat.content}
        </span>
        <i class="fas fa-lg fa-fw me-10px fa-arrow-down"></i>
    </button>
        {:else}
    <!-- 맨아래로 가는 버튼 -->
    <button in:fade={{duration:500}} out:fade={{duration:500}}
        class="bottom-btn" on:click={() => dispatch('scroll_move_last')}>
        <i class="fas fa-arrow-alt-circle-right fa-rotate-90"></i>
    </button>
        {/if}
    {/if}
    {#if response_open}
    <!-- 어디 답글을 달 지 표시 -->
    <div bind:this={replyContainer_ele} class="reply-container" in:fade={{duration:500}}>
        <strong class="reply-target">{response_chat.writer}에게 답장</strong>
        <p class="message">
            {response_chat.content}
        </p>
        <button class="close-btn" on:click={() => {
            dispatch('response_open_false');
            dispatch('response_chat_reset');
        }}></button>
    </div>
    {/if}
    {#if (chat_file && chat_file.length > 0) || request_message}
    <!-- 업로드 할 파일 표시 -->
    <div bind:this={replyContainer_ele2} class="reply-container add-set" in:fade={{duration:500}}
        class:request-message={request_message}>
        <p class="message" style="padding-top: 0">
            {#if request_message}
            <span style="color:#2435b2">확인요청메시지</span>
            {/if}
            {chat_file && chat_file.length > 0 && request_message ? " : " : ""}
            {chat_file && chat_file.length > 0 ? chat_file[0].name : ""}
        </p>
        <button class="close-btn" on:click={() => {
            chat_file = null;
            request_message = false;
        }}></button>
    </div>
    {/if}
    {#if isTest()}
    <button type="button" class="btn-file" 
        on:click={() => {
            dispatch('response_open_false');
            dispatch('response_chat_reset');
            modal_chatAdd.open();
        }}>
    </button>
    {/if}
    <div class="hide">
        <input type="file" id="chat-file" bind:this={fileEle} bind:files={chat_file}>
    </div>
    <div class="input-g">
        <textarea name="" id="chat_textarea" rows={chat_row} class="input-item"
            class:extend={chat_txt.includes("\n")}
         bind:value={chat_txt} placeholder="메세지 입력" />
        <button type="button" class="btn-send" on:click={sendChat}></button>
    </div>
</div>

<style>
#chatInput {
    position:fixed;
}
#chatInput .bottom-btn {
    position: absolute;
    bottom:calc(100% + 7px);
    right:15px;
}
#chatInput .bottom-btn i {
    font-size:30px;
}
#chatInput .bottom-latest-btn {
    bottom:calc(100% + 7px);
    left:10px;
    position: absolute;
    width:calc(100% - 20px);
    background-color: #fff;
    border-radius: 10px;
    height:35px;
    padding: 5px 15px;
    border:1px solid #eee;
    box-shadow: 1px 1px 1px #aaa;
}
#chatInput .bottom-latest-btn span {
    display: inline-block;
    width: calc(100% - 50px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
}
#chatInput .bottom-latest-btn i {
    vertical-align: baseline;
}
#chatInput .add-set {
    padding-right: 20px;
}
#chatInput .add-set.request-message>p {
    position:relative;
}
#chatInput .add-set.request-message>p::after {
    position: absolute;
    left: 12.3px;
    top: 4px;
    content: "";
    display: inline-block;
    background: url(/test/template/img/usr.png) no-repeat 0 0;
    width: 9px;
    height: 12px;
    background-size: 100% auto;
}
.chat-input .input-g .input-item {
    font-size:16px;
}
</style>