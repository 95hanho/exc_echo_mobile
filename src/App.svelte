<script>
	import { onDestroy, onMount } from "svelte";
  import Router, { location, push } from "svelte-spa-router";
	import routes from "./routes";
	import { cookies } from "./cookies";
	import { loginOn, userInfo } from "./store/authSlice";
	import Modal from "./components/modal.svelte";
	import { get_loginType } from "./lib/local_store";

  $:loginType = $userInfo.type

  onMount(() => {
    const rToken = cookies.get('refresh_token');
    if(rToken) loginOn.set(true);
  });
  onDestroy(() => {
  });
</script>

<div id="wrap" class="wrapper" class:login-route={$location === '/login'}>
  <main class:theme-valley={loginType == 'valley'}
  class:theme-tree={loginType == 'tree'}>
    <Router {routes} />
  </main>
</div>
<Modal />

<style>
#wrap {
  /* 동적으로 계산된 높이 사용 */
  /* height: calc(var(--vh, 1vh) * 100 - env(safe-area-inset-bottom) - 80px); */
  /* height: calc(var(--vh, 1vh) * 100); */
}
#wrap.chat-open {
  padding-top: 0;
  /* height: calc(var(--vh, 1vh) * 100 -300px); */
}
#wrap.login-route {
  height: auto;
  padding-top:0;
}
main {
  width:100%;
  height:100%;
}
</style>
