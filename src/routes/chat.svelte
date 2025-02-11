<script>
	import { onDestroy, onMount, tick } from "svelte";
	import { chatService } from "../api";
	import { modal_alert, modal_chatAdd, modal_chatAdd_type, modal_chatReact, modal_chatReact_type } from "../store/modalSlice";
	import ChatHeader from "../components/chat-header.svelte";
	import { querystring, location, replace, push } from "svelte-spa-router";
	import ChatNav from "../components/chat-nav.svelte";
	import ChatAside from "../components/chat-aside.svelte";
	import { userInfo } from "../store/authSlice";
	import { fade } from "svelte/transition";
    import moment from "moment/moment";
	import { chat_scroll_near_last, isdivivedDate, not_scroll, scroll_move_last, scroll_move_read, shake_message, updateViewportHeight, } from "../lib/ui";
	import Lodding from '../components/lodding.svelte';
	import { isTest, testlog } from "../lib/env";
	import { get_echo_record, get_loginType, set_echo_record, set_echo_record_last_scroll } from '../lib/local_store.js';
	import ChatInput from '../components/chat/chat-input.svelte';

    export let params = {};
    $: echo_id = params.echo_id; // 에코아이디
    $: echostep = new URLSearchParams($querystring).get('echostep'); // 채팅방 고유값
    let store_echostep = "";
    // 메뉴 바뀔 때 채팅 새로 가져오기
    $: if(echo_id || echostep) {
        if(echostep) store_echostep = echostep;
        get_chat(echostep);
    }
    /* 채팅내용관련 ========================================> */
    let echo_title = ""; // 채팅제목목
    let chatroom_list = [
        {name:"니즈",},{name:"개발",},{name:"운영",},{name:"강의",},{name:"진행",},{name:"사후",}
    ]; // 채팅방 리스트
    let chat_list = []; // 채팅내용 리스트
    let chatWrap_ele = null; // 채팅div element
    let add_loding = false; // 채팅 더보기 로딩 보여줄지
    let echo_chat_total_count = 0; // 총 페이지 수
    let last_echostep_visit_date = null; // 전에 접속한 시점
    const change_last_echostep_visit_date = (e) => last_echostep_visit_date = e.detail.value;
    let readstart_chat = null; // 읽기시작해야하는 채팅
    let readend_chat = null; // 읽어야하는 마지막 채팅
    let read_ele = null; // 읽시시작해야하는 채팅 element
    let chatWrap_hidden = false; // 채팅창 잠시 가리기
    
    // 채팅가져오기
    const get_chat = async (es, req_page, no_read) => {
        const obj = { echo_id };
        if(es) obj.echostep = es;
        if(req_page == undefined) chat_list = [];
        if(req_page != undefined) obj.page = req_page;
        if(no_read) obj.no_read = no_read;
        add_loding = true;
        if(!es && get_loginType() != 'tree') {
            replace(`${$location}?echostep=2`);
            return;
        }
        // 저장된 로컬데이터 가져오기, 저장 스크롤 위치가기
        let has_local = false;
        let not_equal_chat_list = false; // 로컬데이터와 같은지?
        let chat_last_scroll = undefined;
        if(req_page == undefined) {
            const echo_record = get_echo_record(echo_id);
            if(echo_record && echo_record[es]) {
                testlog('로컬에서 데이터가져오기');
                chatWrap_hidden = true; // 잠시 가림
                has_local = true;
                last_echostep_visit_date = new Date();
                echo_chat_total_count = echo_record[es].cur_page;
                const list = [...echo_record[es].chat_list];
                chat_list = list;
                chat_last_scroll = echo_record[es].chat_last_scroll;
                // await tick();
                // if(echo_record[es].chat_last_scroll) {
                //     chatWrap_ele.scrollTop = echo_record[es].chat_last_scroll;
                // } else scroll_move();
            }
        }
        // 채팅리스트 가져오기 API
        await chatService.get_chatList(obj).then(async(data) => {
            testlog(data);
            // 에코제목
            echo_title = data.echo_title;
            // 최근 현재채팅방 들어온 date(어디까지 읽었는지 기준)
            last_echostep_visit_date = new Date(data.last_echostep_visit_date);
            // 초기 채팅방리스트는 무조건 가져오기
            if(req_page == undefined) {
                chatroom_list = data.echostep_list;
                chatroom_list = chatroom_list;
            }
            // 로컬데이터를 가져왔고, 로컬데이터와 비교해서 새로운 채팅있으면 잠시 가리고 다시 가져옴.
            if(has_local &&
            (chat_list.length > 0 && data.old_chat_list.length > 0
             && chat_list[chat_list.length - 1].chat_id != data.old_chat_list[data.old_chat_list.length - 1].chat_id)) 
            {
                testlog('로컬에서 데이터가져왔는데 새로운 채팅옴. 채팅리스트 초기화');
                not_equal_chat_list = true; // 로컬데이터랑 같지않음
                chat_list = []; // 채팅초기화
            }
            // 로컬데이터 안가져온 쌩 초기상태거나, 로컬데이터 가져왔는데 같은 경우
            if(!has_local || (has_local && not_equal_chat_list)) {
                if(req_page == undefined) {
                    /* TEST */
                    // 반응리스트 예시
                    const example_react_list = [
                        {member_no:"22", name:"정진환"},
                        {member_no:"23", name:"오정택"},
                        {member_no:"50000", name:"한호성"},
                        {member_no:"50001", name:"김효경"},
                    ];
                    data.old_chat_list.map((v) => {
                        v.react_open = false;
                        v.react_list = example_react_list;
                    });
                    /* TEST */
                    if(data.old_chat_list) chat_list.push(...data.old_chat_list);
                    echo_chat_total_count = data.echo_chat_total_count;
                    // 앞 페이지가 더 있는데 채팅 갯수가 5개이하면 더 불러옴
                    if(echo_chat_total_count >= 1 && chat_list.length <= 5) {
                        echo_chat_total_count = echo_chat_total_count - 1;
                        get_chat(es, echo_chat_total_count, true);
                        return;
                    }
                    chat_list = chat_list;
                    await tick();
                    // 앞 페이지가 더 있는데 채팅스크롤이 없으면 더 불러옴
                    if(echo_chat_total_count >= 1 && not_scroll(chatWrap_ele)) {
                        echo_chat_total_count = echo_chat_total_count - 1;
                        get_chat(es, echo_chat_total_count, true);
                        return;
                    }
                    scroll_move();
                }
                // 추가 페이지 가져오기
                else {
                    if(data.old_chat_list) chat_list.unshift(...data.old_chat_list)
                    if(data.latest_chat_list) chat_list.push(...data.latest_chat_list);
                    chat_list = chat_list;
                    await tick();
                    if(read_ele) scroll_move();
                    else chatWrap_ele.scrollTop = chatWrap_ele.scrollHeight - chat_height;
                    // chatWrap_ele.scrollTop = chatWrap_ele.scrollHeight - chat_height;
                }
            }
            chatWrap_hidden = false;
            chatWrap_ele.removeEventListener('scroll', scroll_move_event);
            chatWrap_ele.addEventListener('scroll', scroll_move_event);
            // 해당 에코의 에코스탭 접속기록을 저장함.
            set_echo_record(echo_id,
                {
                    echostep:es, 
                    [es]: {
                        chat_list,
                        cur_page: req_page || echo_chat_total_count,
                        // max_page: data.echo_chat_total_count,
                    }
                }
            );

            return data;
        }).catch((err) => {
            if(err.msg == "CHAT_UNAUTHORIZED") {
                modal_alert.open('허가되지않은 프로젝트입니다.');
                push('/');
            }
        });
        add_loding = false;
        if(has_local && !not_equal_chat_list) {
            await tick();
            if(chat_last_scroll) {
                testlog(chat_last_scroll + '스크롤위치로 이동')
                chatWrap_ele.scrollTop = chat_last_scroll;
            } else scroll_move();
        }
    }
    $: if(chatWrap_ele && chat_list.length > 0) {
        when_to_change_chat_list();
    }
    // 채팅리스트 갯수가 변화할 때
    const when_to_change_chat_list = async () => {
        readstart_chat = null;
        readend_chat = null;
        let readstart_chat_store = null;
        let readend_chat_store = null;
        // 
        for(let i = chat_list.length - 1; i >= 0; i--) {
            let chat = chat_list[i];
            const created_At = new Date(chat.createdAt);
            // if(chat.member_no != $userInfo.member_no && last_echostep_visit_date < created_At) {
            if(last_echostep_visit_date < created_At) {
                readstart_chat_store = chat;
                readend_chat_store = chat_list[chat_list.length - 1];
                // 채팅 가져온거 첫 번째꺼 까지 안읽은거면 잠시 가리고 앞 페이지 더 가져오기
                if(i == 0 && echo_chat_total_count >= 1) {
                    chatWrap_hidden = true;
                    readstart_chat_store = null;
                    readend_chat_store = null;
                    echo_chat_total_count = echo_chat_total_count - 1;
                    await get_chat(echostep, echo_chat_total_count, true);
                }
            } else break;
        }
        if(readstart_chat_store && readend_chat_store) {
            readstart_chat = readstart_chat_store;
            readend_chat = readend_chat_store;
            chatWrap_hidden = false;
        }
        chat_height = chatWrap_ele.scrollHeight;
    }

    /* 채팅확인 요청 관련 ========================================================> */
    let react_show_index_obj = {};
    // 채팅확인 사람 보여주기
    const show_react = async (chat) => {
        chat.react_open = true;
        chat_list = chat_list;
        await tick();
        // 채팅스크롤이 맨 밑과 가까우면 맨밑으로 내려줌
        if(chat_scroll_near_last(chatWrap_ele)) {
            scroll_move_last(chatWrap_ele);
        }
        clearTimeout(react_show_index_obj[chat.chat_id]);
        react_show_index_obj[chat.chat_id] = setTimeout(() => {
            chat.react_open = false;
            chat_list = chat_list;
        }, 5000);
    }
    // 반응리스트 '자신' 제외 리스트
    const react_list_except_me = (in_list) => {
        return in_list.filter((v) => $userInfo.member_no != v.member_no);
    }

    /* 채팅입력관련 ========================================> */
    let chat_input_ref = null;
    let chatWrap_calc_height = 0; // 채팅입력 높이에 따라 채팅리스트창 높이조절
    const change_chatWrap_calc_height = (e) => chatWrap_calc_height = e.detail.value;

    // 파일 업로드
    const file_upload = () => {
    }

    /* 채팅 누르고 있기 팝업 관련 ========================================> */
    let response_open = false; // 클릭하고 있던 채팅아이디(답변창 오픈용)
    let touch_chat_id = 0; // 클릭사작한 채팅아이디(touch_chat_id -> response_open)
    let response_chat = null; // 클릭한 채팅객체
    let reactPopup_index = null;
    // 채팅 touchstart
    const chatContent_touchstart = (e, chat) => {
        if(!e.target.closest(".check-usr") && !e.target.closest(".message-check")) {
            chat_input_ref.reset_chat_file();
            chat_input_ref.reset_request_message();
            touch_chat_id = chat.chat_id;
            reactPopup_index = setTimeout(() => {
                e.preventDefault();
                response_chat = chat;
                if(chat.member_no == $userInfo.member_no) response_chat.writer = "나";
                if(isTest() && chat.member_no == $userInfo.member_no) {
                    modal_chatReact.open();
                } else {
                    response_open = true;
                }
            },  500);
        }
    }
    // 채팅 touchend
    const chatContent_touchend = () => {
        clearTimeout(reactPopup_index);
        touch_chat_id = 0;
    }
    // 채팅 반응 팝업 동작
    $:if($modal_chatReact_type) {
        // 대화반응
        if($modal_chatReact_type == 1) {
        } 
        // 답변하기
        else if($modal_chatReact_type == 2) {
            response_open = true;
        }
        // 그냥 종료
        else if($modal_chatReact_type == 3) {
            response_chat = null;
        }
        //
        modal_chatReact_type.set(0);
    }

    /* 채팅창 스크롤 관련 ===================================================> */
    // 채팅창 스크롤 시
    let chat_height = 0; // 채팅 스크롤 가능 높이
    let respond_id = null; // 답장글 클릭 시 답장 글 element
    let bottom_btn_on = false; // 가장 아래 스크롤 버튼이 생길지
    let cur_chat_scrollTop = 0; // 현재 스크롤 위치
    // 채팅 스크롤 이벤트
    const scroll_move_event = async (e) => {
        chatContent_touchend(); // 스크롤이 시작하면 누르기는 취소
        let scrTop = e.target.scrollTop;
        let scrHeight = e.target.scrollHeight;
        let height = e.target.clientHeight;
        // 스크롤 없으면 작동X
        if(height == scrHeight) return;
        // 맨 위 스크롤 시 채팅 더 가져오기
        if(scrTop < 10 && !add_loding) {
            if(echo_chat_total_count > 0) {
                echo_chat_total_count = echo_chat_total_count - 1;
                await get_chat(echostep, echo_chat_total_count, true);                
            }
        }
        // 맨 밑보다 300px 정도 위로 가면 가장 아래로 이동 버튼생김
        if(scrTop < scrHeight - height - 300) bottom_btn_on = true;
        else bottom_btn_on = false;
        if(respond_id) {
            shake_message(respond_id);
            respond_id = null;
        }
        // 맨 밑에 일 때!!!
        if(scrTop > scrHeight - height - 10) {
            readend_chat = null;
        }
        // 채팅창 스크롤 따로 저장
        cur_chat_scrollTop = scrTop;
    }
    // 채팅창 스크롤
    const scroll_move = () => {
        if(read_ele) scroll_move_read(read_ele, chatWrap_ele);
        else scroll_move_last(chatWrap_ele);
    }
    // 해당 에코의 스크롤위치를 저장함.
    const store_scroll_position = () => {
        set_echo_record_last_scroll(echo_id, store_echostep, cur_chat_scrollTop);
    }

    /* 답장채팅 위치로 가기 ===================================================> */
    const move_respond_message = async (chat) => {
        respond_id = `chat${chat.respond.chat_id}`;
        const element = document.getElementById(respond_id);
        if(element) scroll_move_read(element, chatWrap_ele);
        else {
            const before_scr_height = chatWrap_ele.scrollHeight;
            const before_scr_top = chatWrap_ele.scrollTop;
            echo_chat_total_count = echo_chat_total_count - 1;
            await get_chat(echostep, echo_chat_total_count, true);
            // 이동 중에 보고있는 스크롤 유지
            chatWrap_ele.scrollTop = before_scr_top + chatWrap_ele.scrollHeight - before_scr_height;
            move_respond_message(chat);
        }
    }

    /* 더보기 메뉴바 ========================================> */
    let asideOpen = false; // 메뉴바 오픈
    const change_asideOpen = () => asideOpen = !asideOpen;


    onMount(async () => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        // updateViewportHeight();
        const echo_record = get_echo_record(echo_id);
        if(echo_record) {
            replace(`${$location}?echostep=${echo_record.echostep || 2}`);
        } else {
            await get_chat();
        }
    });
    onDestroy(() => {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        store_scroll_position();
    });
</script>

<div id="chat" in:fade={{duration: 500}} class:theme-valley={get_loginType() == 'valley'}
    class:theme-tree={get_loginType() == 'tree'}>
    <ChatHeader {change_asideOpen} {echo_title}/>
    <div id="chatContent" class="main-content">
        {#if get_loginType() != 'tree'}
        <ChatNav {chatroom_list} on:store_scroll_position={store_scroll_position} />
        {/if}
        <!-- chat -->
        <div class="chat-container">
            {#if chatWrap_hidden}
            <Lodding />
            {/if}
            <div id="chatWrap" bind:this={chatWrap_ele} class="chart-main"
                class:visible-hidden={chatWrap_hidden}
                style={`height: calc(100% - ${chatWrap_calc_height}px);`}>
                {#if add_loding}
                <Lodding />
                {/if}
                {#if !add_loding && chat_list.length == 0}
                <div class="empty-chat">비어있음</div>
                {/if}
                {#each chat_list as chat, index}
                <!-- 여기까지 읽으셨습니다. -->
                {#if readstart_chat?.chat_id == chat.chat_id}
                <div class={`divider`} bind:this={read_ele}>
                    <span style="font-weight: bold;color:#000">여기까지 읽으셨습니다.</span>
                </div>
                {/if}
                <!-- 날짜 구분선 -->
                {#if isdivivedDate(chat.createdAt, chat_list[index - 1]?.createdAt)}
                <div class="divider"><span><i></i>{moment(chat.createdAt).format('YYYY.MM.DD')}</span></div>    
                {/if}
                <!-- 메시지 -->
                <div id={`chat${chat.chat_id}`} class="chat-message-item">
                    <div class="chat-message" class:received={chat.member_no != $userInfo.member_no}
                        class:sent={chat.member_no == $userInfo.member_no}>
                        <div class="chat-sender">
                            {#if chat.member_no != $userInfo.member_no}
                            <span class="name" style="padding-right: 5px;">{chat.writer} {chat.position}{!chat.is_customer ? "(expert)" : ""}</span>
                            {/if}
                            <span class="date">{moment(chat.createdAt).format('MM.DD HH:mm')}</span>
                        </div>
                        <div class="chat-bubble"
                            class:touch={touch_chat_id == chat.chat_id}
                            class:respond={response_chat?.chat_id === chat.chat_id}
                            on:touchstart={(e) => chatContent_touchstart(e, chat)}
                            on:touchend={chatContent_touchend}
                            on:touchcancel={chatContent_touchend}>
                            {#if chat.respond}
                            <div role="button" tabindex="0"
                                style="cursor: pointer;"
                                on:click|preventDefault={() => move_respond_message(chat)}>
                                <div class="rply-tit">{chat.respond.writer}에게 답장</div>
                                <div class="rply-org-ment">{@html chat.respond.content.replace(/\n/g, '<br />')}</div>
                            </div>
                            {/if}
                            <p>{@html chat.content.replace(/\n/g, "<br />")}</p>
                            {#if isTest()}
                                {#if chat.file}
                            <div class="file-link-zone">
                                <a href={chat.file.name} download class="file-link">{chat.file.name}</a>
                            </div>
                                {/if}
                            {/if}
                            {#if chat.member_no != $userInfo.member_no}
                                {#if isTest()}
                                    {#if chat.react_list.some((v) => v.member_no == chat.member_no)}
                            <button type="button" class="message-check" on:click={() => {
                                show_react(chat);
                            }}></button>
                                    {:else}
                            <button type="button" class="message-check off" on:click></button>
                                    {/if} 
                                {/if}
                            {/if}
                            {#if chat.member_no == $userInfo.member_no && chat.react_list.length > 0}
                                {#if isTest()}
                            <button class="check-usr" on:click|stopPropagation={() => show_react(chat)}><span>8</span></button>
                                {/if}
                            {/if}
                        </div>
                    </div>
                </div>
                {#if isTest() && chat.react_list.length > 0 && chat.react_open}
                <p class="react-member" class:my={chat.member_no == $userInfo.member_no}
                    in:fade={{duration:300}} out:fade={{duration:500}}>
                    {#each react_list_except_me(chat.react_list) as react, index}
                    <span>{react.name}{#if react_list_except_me(chat.react_list).length - 1 != index}, {/if}</span>    
                    {/each}
                </p>
                {/if}
                {/each}
            </div>
        
            <ChatInput bind:this={chat_input_ref} {bottom_btn_on} {readend_chat} {chatWrap_ele} 
                on:scroll_move_last={() => scroll_move_last(chatWrap_ele)} 
                {response_open} on:response_open_false={() => response_open = false}
                {response_chat} on:response_chat_reset={() => response_chat = null}
                {echo_id} {echostep} {chat_list} {read_ele}
                on:scroll_move={scroll_move} on:change_levd={change_last_echostep_visit_date}
                on:change_chatWrap_calc_height={change_chatWrap_calc_height}
                on:change_chat_list={(e) => chat_list = e.detail.value} />
        </div>
        <!-- chat -->
    </div>

    <ChatAside {asideOpen} on:change_asideOpen={change_asideOpen} echo_id={params.echo_id}
        echostep={store_echostep} />
</div>

<style>
#chat {
    height: 100%;
}
#chatContent {
    height: calc(100% - 64px);
}
#chat, .main-content {
    /* width:100%; */
    /* height:100%; */
}
.main-content {
    position: relative;
}
.chat-container {
    /* height: 395px; */
    /* height:calc(var(--vh, 1vh)* 100 - 138px); */
    /* height: calc(100vh - 292px); */
    height: calc(100% - 70px);
    /* height:auto; */
}
.theme-tree .chat-container {
    height: calc(100%);
}
#chatWrap {
    padding-bottom: 10px;
    user-select: none;
}
.empty-chat {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #a4a4a4;
}
.chat-message-item + .chat-message-item {
    margin-top:20px;
}
.divider {
    padding: 13px 0;
}
.chat-sender {
    font-size:13px;
    color: #333333;
}
.message-check.off {
    background-image: url("/template/img/icon_check_off.png");
}
.react-member {
    display: block;
    color:#2435b2;
    font-size:12px;
    padding:10px;
}
.react-member.my {
    text-align: right;
}
.react-member>span {
    display: inline-block;
    padding-right:3px;
}
.chat-message .check-usr {
    bottom:auto;
}
.chat-sender .date {
    font-size:12px;
}
.chat-message .chat-bubble {
	box-shadow: 2px 2px 2px #aaa;
}
.chat-message .chat-bubble.touch {
    position:relative;
    left:2px;
    top:2px;
    box-shadow: none;
}
/* 채팅창 채팅클릭 시 표시 */
.chat-message .chat-bubble.respond {
    border: 2px dashed #888;
}
.message-check {
	right: -2px;
}
/* 좌우로 2초동안 흔들림 */
@keyframes shake {
  0% { transform: translateY(0); }
  14.28% { transform: translateY(-5px) }
  28.56% { transform: translateY(5px); }
  42.84% { transform: translateY(-5px); }
  57.12% { transform: translateY(5px); }
  71.4% { transform: translateY(-5px); }
  85.68% { transform: translateY(5px); }
  100% { transform: translateY(0); }
}
.shake {
  animation: shake 2s ease-in-out;
}
</style>