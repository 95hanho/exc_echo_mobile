<!-- 메인화면 - 교육프로그램 목록 -->
<script>
	import { onDestroy, onMount, tick } from "svelte";
	import { authService, mainService } from "../api";
	import { link, push } from "svelte-spa-router";
	import MainHeader from "../components/main-header.svelte";
	import { loginOn, userInfo } from "../store/authSlice";
	import { modal_alert, modal_confirm, modal_confirm_result, modal_dialog, modal_dialog_list } from "../store/modalSlice";
	import moment from "moment";
	import Lodding from "../components/lodding.svelte";
	import { get_main_last_scroll, set_main_last_scroll } from "../lib/ui";
	import { main_last_scroll } from "../store/uiSlice";
	import MainAside from "../components/main-aside.svelte";
	import { get_loginType, get_search_keyword, get_search_type, remove_search_keyword, set_search_keyword, set_search_type } from "../lib/local_store";
    import diagonal from '../assets/images/diagonal.png';

    let type = ""; // ridge valley tree

    /* 에코 상단고정 ===================================== */
    let confirm_id = 0;
    $:if($modal_confirm_result == "echoFix") {
        echoFix(confirm_id);
        confirm_id = 0;
        modal_confirm_result.set('');
    }
    const echoFix = (echo_id) => {
        echoList_await = null;
        mainService.set_echoFix({
            echo_id
        }).then((data) => {
            if(!search_on) {
                get_echos();
            } else {
                echo_search_before();
            }
        });
    }
    /* 에코 리스트 가져오기 ===================================== */
    let lodding = false;
    let echoList_await = null;
    const get_echos = async () => {
        lodding = true;
        echoList_await = await mainService.get_echoList().then((data) => {
            $modal_dialog_list = data.account_list;
            return data;
        });
        await tick();
        lodding = false;
        set_main_last_scroll($main_last_scroll);
    }
    /* 에코 검색 ==================================> */
    let search_on = false; // 검색중인지
    let search_ing = false; // 검색API 요청인지
    let sc_keyword = ""; // 검색텍스트
    let result_keyword = ""; // 검색결과텍스트
    let sc_type = "PROJECT_SUSSCESS_CODE";
    // 키워드 필터링
    const sc_keyword_filter = (e) => {
        if(sc_type == "PROJECT_SUSSCESS_CODE") {
            let value = e.target.value;
            // 숫자만 남기기
            value = value.replace(/[^0-9]/g, '');
            // 형식 맞추기
            if (value.length > 4) value = value.slice(0, 4) + '-' + value.slice(4, 7);
            // 최대 7자리까지 제한
            if (value.length > 9) value = value.slice(0, 9);
            sc_keyword = value; // 값 업데이트
        }
    }
    // 검색 API 실행
    const echo_search_before = async () => {
        set_search_type(sc_type);
        // PROJECT_SUSSCESS_CODE 수주코드 XXX-XXXX
        // CUSTOMER_CORP_NAME 고객사 공백제외 2글자 이상
        // AM_NAME AM 공백제외 2글자 이상
        if(sc_type == "PROJECT_SUSSCESS_CODE" && !/^\d{4}-\d{3}$/.test(sc_keyword)) {
            modal_alert.open(`수주코드를 제대로 입력해주세요.<br />'000-0000'(0은 숫자)`)
            return;
        } else {
            const str = sc_keyword.replace(/\s+/g, "")
            if(str.length < 2) {
                modal_alert.open('2글자 이상 입력해주세요.');
                return;
            }
        }
        if(search_ing) return;
        search_ing = true;
        lodding = true;
        echoList_await = await authService.echo_search({
            sc_type,
            sc_keyword,
        }).then((data) => {
            result_keyword = sc_keyword;
            if(data.echo_list.length > 0) set_search_keyword(sc_keyword);
            return data; 
        }).catch((err) => {
            modal_alert.open('서버 오류. 문의 바람.');
        });
        search_ing = false;
        await tick();
        lodding = false;
        set_main_last_scroll($main_last_scroll);
    }

    /* 메뉴바 ========================================> */
    let asideOpen = false; // 메뉴바 오픈
    const change_asideOpen = () => asideOpen = !asideOpen;

    onMount(() => {
        type = get_loginType();
        sc_type = get_search_type();
        sc_keyword = get_search_keyword();
        if(type == "valley" && sc_keyword) {
            search_on = true;
            echo_search_before();
        } else get_echos();
    });
    onDestroy(() => {
        $main_last_scroll = get_main_last_scroll();
    });
</script>

<div id="main" class:theme-valley={get_loginType() == 'valley'}
class:theme-tree={get_loginType() == 'tree'}>
    <MainHeader {change_asideOpen} />
    <div class="main-content">
        <nav class="top-group" style={`height: ${search_on ? 140 : 112}px`}>
            <div class="container">
                <div class="user-name">안녕하세요. <b>{$userInfo.name} {$userInfo.position}님</b></div>
                <!-- {#if $modal_dialog_list && $userInfo.type == 'valley'}
                <a href="#" class="btn-setting" role="button" tabindex="0"
                    on:click|preventDefault={modal_dialog.open}
                    on:keydown|preventDefault={(e) => {
                        if(e.key == 'Enter') {
                            e.preventDefault();
                            modal_dialog.open();
                        }
                    }}>계정설정</a> -->
                {#if search_on && get_loginType() == 'valley'}
                <a href="#" class="btn-setting" role="button" tabindex="0"
                    on:click|preventDefault={() => {
                        search_on = false;
                        sc_keyword = "";
                        $main_last_scroll = 0;
                        remove_search_keyword();
                        get_echos();
                    }}
                    on:keydown|preventDefault={(e) => {
                        if(e.key == 'Enter') {
                            e.preventDefault();
                            search_on = false;
                            sc_keyword = "";
                            $main_last_scroll = 0;
                            remove_search_keyword();
                            get_echos();
                        }
                    }}>검색취소</a>
                {:else if !search_on && get_loginType() == 'valley'}
                <a href="#" class="btn-setting" role="button" tabindex="0"
                    on:click|preventDefault={() => {
                        search_on = true;
                        $main_last_scroll = 0;
                        echoList_await = null;
                    }}
                    on:keydown|preventDefault={(e) => {
                        if(e.key == 'Enter') {
                            e.preventDefault();
                            search_on = true;
                            $main_last_scroll = 0;
                            echoList_await = null;
                        }
                    }}>과정검색</a>
                {/if}
            </div>
            {#if search_on && get_loginType() == "valley"}
            <div class="container">
                <form on:submit|preventDefault={echo_search_before}>
                    <div class="main-search">
                        <select name="" id="" bind:value={sc_type} on:change={() => {
                            sc_keyword = "";
                        }}>
                            <option value="PROJECT_SUSSCESS_CODE">수주코드</option>
                            <option value="CUSTOMER_CORP_NAME">고객사</option>
                            <option value="AM_NAME">AM</option>
                        </select>
                        <span class="window">
                            <input type="text" placeholder="검색어를 입력해주세요." bind:value={sc_keyword} on:input={sc_keyword_filter}>
                            <button type="submit"></button>
                        </span>
                    </div>
                </form>
            </div>
            {/if}
        </nav>
        {#if lodding}
        <div style="padding-top:30px">
            <Lodding />
        </div>
        {/if}
        {#await echoList_await then data}
        {#if data}
        <div class="post">
            <div class="container">
                {#if data.echo_list.length > 0}
                {#each data.echo_list as echo, index}
                <button class="post-item d-block"
                    class:except={echo.echo_publish_type && echo.echo_publish_type != 'REGIST'}
                    style={echo.echo_publish_type && echo.echo_publish_type != 'REGIST' ? `background-image: url(${diagonal});background-color:#eee` : ''}
                    on:click={() => {
                        if(!echo.echo_publish_type || echo.echo_publish_type == 'REGIST') {
                            push(`/chat/${echo.echo_id}`);
                        }
                    }}>
                    <!-- <i class="icon-bell active" class:active={echo.alert_status}></i> -->
                     {#if echo.echo_publish_type && echo.echo_publish_type != 'REGIST'}
                     <div class="not-echo" class:ignore={echo.echo_publish_type == 'IGNORE'}>
                        <span>{echo.echo_publish_type == 'NOT_REGIST' ? "에코 등록이 필요합니다." : '제외된 에코'}</span>
                    </div>
                     {/if}
                    <div class="details">
                        <p class="subject">
                            <a href="##" on:click|preventDefault>{echo.echo_title}</a>
                        </p>
                        <div class="manage">
                            <span class="name">
                                {#if echo.echo_am}
                                담당AM {echo.echo_am}
                                {/if}
                            </span>
                            <span class="number">
                                {#if echo.customer_unread}
                                <em class="text-red">{echo.customer_unread || ""}</em>
                                {/if}
                                {#if echo.my_unread}
                                <em class="text-green">{echo.my_unread || ""}</em>
                                {/if}
                            </span>
                            <!-- 업체명 -->
                            {#if search_on}
                            <span class="search-real">
                                {echo.echo_project_company_name}
                            </span>
                            {/if}
                            <!--  -->
                        </div>
                        {#if !search_on}
                        <div class="date">{moment(echo.echo_edu_start_date).format('MM-DD')} ~ {moment(echo.echo_edu_end_date).format('MM-DD')}</div>
                        {:else}                            
                        <div class="date">
                            {#if search_on}
                            <div class="project-code">{echo.echo_project_code}</div>    
                            {/if}
                            {moment(echo.echo_edu_start_date).format('YYYY')} {moment(echo.echo_edu_start_date).format('MM-DD')} ~ {moment(echo.echo_edu_end_date).format('MM-DD')}
                        </div>
                        {/if}
                    </div>
                    {#if get_loginType() == 'valley' && (!echo.echo_publish_type || echo.echo_publish_type == 'REGIST')}
                    <button type="button" class="pin" class:active={echo.top_fixed}
                        on:click|stopPropagation={() => {
                            if(echo.top_fixed) {
                                confirm_id = echo.echo_id;
                                modal_confirm.open("관심등록을 해제하시겠습니까?", "echoFix");
                            }
                            else echoFix(echo.echo_id);
                        }}>
                        <i class="icon-pin"></i>
                    </button>
                    {/if}
                </button>
                {/each}
                {:else}
                <div style="padding-top: 50px;text-align: center;">
                    <p style="color:#a4a4a4">
                        결과값이 없습니다.
                        {#if sc_type != "PROJECT_SUSSCESS_CODE"}
                        <br />(고객사, AM 검색조건은 운영기간이 지난 과정은 조회 되지 않습니다.)
                        {/if}
                    </p>
                </div>
                {/if}
            </div>
        </div>
        {/if}
        {/await}
    </div>
    <MainAside {asideOpen} {change_asideOpen} />
</div>

<style>
#main {
    width:100%;
    height:100%;
    min-height: 100vh;
    /* overflow: scroll; */
    overflow: auto;
}
.post {
    padding-bottom: 30px;
}
.post .search-real {
	color:#575656;
    font-size: 14px;
    width: 113px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
}
.post-item {
    padding: 18px 20px 18px 20px;
}
.theme-valley .post-item {
    padding: 18px 40px 18px 20px;
}
.theme-tree .post-item {
    padding: 18px 40px 18px 20px;
}
.post-item .not-echo {
    position:absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    text-align: center;
    align-content: center;
    font-size:23px;
    font-weight: bold;
    color:#555;
}
.post-item .not-echo.ignore {
    color:rgb(250, 57, 23)}
.post-item .not-echo span {
    position:relative;
    display: inline-block;
}
.post-item.except .details {
    opacity: 0.5;
}
.post-item .subject a {
    text-align: left;
}
/* 담당AM글자크기 너무 커!! */
.post-item .manage .name {
    font-size: 13px;
}
.post-item .project-code {
    position: absolute;
	color:#000;
}
.post-item .date {
    text-align:right;
}



</style>