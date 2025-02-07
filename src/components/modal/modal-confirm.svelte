<script>
	import { modalUI } from '../../lib/ui.js';
    import { modal_confirm, modal_confirm_txt } from '../../store/modalSlice.js';
    
    let modalEle = null;
    let modalWrapEle = null;

    const { close, check } = modal_confirm;
    $: if($modal_confirm) {
        modalUI.open(modalEle);
        modalWrapEle.focus();
        document.addEventListener('keydown', escClose);
    }
    else {
        modalUI.close(modalEle);
        document.removeEventListener('keydown', escClose);
    }
    const escClose = (e) => {
        if(e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
            close();
        }
    }
</script>

<div class="modal" bind:this={modalEle}>
    <button
        class="modal-background"
        on:click={() => close()}
    ></button>
    <div class="modal-board">
        <div class="modal-content">
            <div class="modal-title">알림창</div>
            <div class="modal-con">
                <p>{@html $modal_confirm_txt}</p>
            </div>
            <div class="modal-btn_wrap">
                <button
                type="button"
                class="modal_close"
                on:click={() => close()}
                tabindex="0"
                >
                닫기
                </button>
            </div>
            <div class="modal-confirm">
                <button tabindex="0" on:click={check} 
                    bind:this={modalWrapEle}
                    class="btn btn-primary me-1">확인</button>
                <span></span>
                <button tabindex="0" on:click={close} 
                class="btn btn-danger">취소</button>
            </div>
        </div>
    </div>
</div>

<style>
.modal {
    z-index:1022;
}
.btn {
    min-width:80px;
    color:#fff;
    border-radius: 5px;
    padding:8px 20px;
}
.modal-confirm {
    padding:0 15px 10px;
    text-align: right;
}
.btn-primary {
    background-color: rgb(23, 114, 218);
}
.btn-danger {
    background-color: rgb(241, 39, 39);
}
</style>