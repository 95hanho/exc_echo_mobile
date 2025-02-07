<script>
    import { modal_dialog, modal_dialog_list } from '../../store/modalSlice.js';
	import { modalUI } from '../../lib/ui.js';
    let modalEle = null;
    let closeBtn = null;

    const { close } = modal_dialog;
    $: dialog_list = $modal_dialog_list;
    $: if($modal_dialog) {
        // modalUI.open(modalEle)
        modalEle.style.display = "block";
        closeBtn.focus();
        document.addEventListener('keydown', escClose);
    } else {
        if(modalEle) modalEle.style.display = "none";
        // modalUI.close(modalEle);
        document.removeEventListener('keydown', escClose);
    }

    const escClose = (e) => {
        if(e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
            close();
        }
    }
</script>

<dialog bind:this={modalEle}>
    <div class="dialog-container">
        <div class="dialog-header">
            <h2>계정설정</h2>
            <button type="button" class="dialog-close"
                tabindex="0"
                bind:this={closeBtn}
                on:click={close}>
                <i class="icon-close"></i>
            </button>
        </div>
        <div class="dialog-content">
            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>비밀번호</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if dialog_list}
                        {#each dialog_list as dialog, index}
                        <tr>
                            <td>{index + 1}</td>
                            <td>{dialog.account_id}</td>
                            <td>{dialog.account_name}</td>
                            <td>
                                <button type="button" class="btn-reset">
                                    <i></i>
                                    초기화
                                </button>
                            </td>
                            <td>
                                <select name="" id="" class="select"
                                    bind:value={dialog.account_status}>
                                    <option value="S">허용</option>
                                </select>
                            </td>
                        </tr>
                        {/each}
                        {/if}
                        <!-- <tr>
                            <td>1</td>
                            <td>16945-001</td>
                            <td>홍길동주임</td>
                            <td>
                                <button type="button" class="btn-reset">
                                    <i></i>
                                    초기화
                                </button>
                            </td>
                            <td>
                                <select name="" id="" class="select">
                                    <option value="">허용</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>16945-001</td>
                            <td>홍길동주임</td>
                            <td>
                                <button type="button" class="btn-reset">
                                    <i></i>
                                    초기화
                                </button>
                            </td>
                            <td>
                                <select name="" id="" class="select">
                                    <option value="">허용</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>16945-001</td>
                            <td>홍길동주임</td>
                            <td>
                                <button type="button" class="btn-reset">
                                    <i></i>
                                    초기화
                                </button>
                            </td>
                            <td>
                                <select name="" id="" class="select">
                                    <option value="">허용</option>
                                </select>
                            </td>
                        </tr> -->
                    </tbody>
                </table>
            </div>

            <ul class="list-1 mt-50">
                <li>
                    <strong>로그인 잠금</strong>
                    <p>잠금으로 상태 변경 시 해당 담당자는 에코시스템에 접속할 수없으며, 담당자 리스트에서 제외됩니다. </p>
                </li>
                <li>
                    <strong>비밀번호 초기화</strong>
                    <p>
                        비밀번호 5회 이상 불일치로 로그인이 제한된 경우 또는 비밀번호 분실로 재발급이 필요한 경우  초기화 버튼을 클릭해주세요. <br>(초기화 비밀번호:echoi234)
                    </p>
                </li>
            </ul>

            <div class="notice-txt mt-25">
                * 아이디가 생성된 임직원만 확인할 수 있습니다. <br>
                * 아이디 신규생성은 담당 AM(영업자)에게 문의해주세요.
            </div>

        </div>
    </div>
</dialog>

<style>
dialog {
    display: none;
}

</style>