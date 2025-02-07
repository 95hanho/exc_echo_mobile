<script>
    import { modal_chatAdd } from '../../store/modalSlice.js';
	import { fade } from 'svelte/transition';

    let closeLock = true;

    const { close } = modal_chatAdd;
    $: if($modal_chatAdd) {
        setTimeout(() => {
            closeLock = false;
        }, 500);
        document.addEventListener('keydown', escClose);
    } else {
        closeLock = true;
        document.removeEventListener('keydown', escClose);
    }


    const escClose = (e) => {
        if(e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
            close();
        }
    }

    const react = (type) => {
        if(closeLock) return;
        modal_chatAdd.react(type);
    }

    const outClick = (e) => {
        if(closeLock) return;
        const dialogContainer = e.currentTarget.querySelector('.dialog-container');
        if (!dialogContainer.contains(e.target)) {
            close();
        }
    }

</script>

{#if $modal_chatAdd}
<dialog id="exampleDialog" on:click={outClick} in:fade={{ duration:300 }} out:fade={{ duration: 300 }}>
    <div class="dialog-container">
        <!-- <div class="dialog-header">
            <h2>&nbsp;</h2>
            <button type="button" class="dialog-close">
                <i class="icon-close"></i>
            </button>
        </div> -->
        <div class="dialog-content">
            <div class="dialog-rply">
                <div><a class="fn" on:click|preventDefault={() => react(1)}>파일업로드</a></div>
                <div><a class="fn" on:click|preventDefault={() => react(2)}>확인 요청메시지</a></div>
            </div>
        </div>
    </div>
</dialog>
{/if}

<style>
</style>