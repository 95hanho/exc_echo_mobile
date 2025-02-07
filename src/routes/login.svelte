<!-- 로그인 -->
<script>
	import { onMount } from "svelte";
	import { last_connect_url, loginOn } from "../store/authSlice";
	import { push, querystring, replace } from "svelte-spa-router";
	import { authService } from "../api";
	import { modal_alert } from "../store/modalSlice";
    import ridge_logo from '/template/img/logo-2.png';
    import valley_logo from '/template/img/valley.png';
    import tree_logo from '/template/img/tree.png';
	import { set_loginType } from "../lib/local_store";

    export let params;
    // 계정 정보
    const user = {
        user_id: "",
        password: "",
        type: "",
    }
    // 로그인
    const login_before = () => {
        user.user_id = user.user_id.trim();
        user.password = user.password.trim();
        user.type = params.type;
        // return;
        authService.login(user).then((data) => {
            loginOn.login(data.access_token, data.refresh_token);
            set_loginType(user.type);
            if($last_connect_url) {
                push($last_connect_url);
                last_connect_url.set("");
            } else push("/");
            
        }).catch((err) => {
            if(err.msg == "LOGIN_WRONG") {
                modal_alert.open('아이디/비번을 확인해주세요.');
            } else {
                modal_alert.open('');
            }
        });
    }

    $: if(!['ridge', 'valley', 'tree'].includes(params.type)) {
        modal_alert.open('잘 못 된 접근입니다.');
        replace("/notPage");
    }

onMount(() => {
    if($loginOn) {
        push('/');
    }
});
</script>

<div id="login" class="login">
    <!-- <TestLogin /> -->
    <div class="login-frame">
        <form on:submit|preventDefault={login_before} >
            <div class="login-logo">
                <p>엑스퍼트컨설팅</p>
                {#if params.type == 'ridge'}
                <img src={ridge_logo} alt="echo ridge">
                {:else if params.type == 'valley'}
                <img src={valley_logo} alt="echo valley">
                {:else if params.type == 'tree'}
                <img src={tree_logo} alt="echo tree">
                {/if}
            </div>
            <div class="form-group">
                <input type="text" id="loginId" autocomplete="on" bind:value={user.user_id} class="input" placeholder="ID를 입력해 주세요." required>
                <input type="password" autocomplete="new-password" id="loginPwd" bind:value={user.password} class="input" placeholder="Password를 입력해 주세요." required>
                <button type="submit" class="btn-submit">Login</button>
            </div>
        </form>
    </div>
</div>

<style>
#login {
    width: 100vw;
    height: 100vh;
    background: #c5d3e7 url(/template/img/login.png) no-repeat 50% 50%;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>