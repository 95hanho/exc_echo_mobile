<script>
    import { modal_chatReact } from '../../store/modalSlice.js';
	import { fade } from 'svelte/transition';

    let closeLock = true;

    $: if($modal_chatReact) {
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
            react(3);
        }
    }

    const react = (type) => {
        if(closeLock) return;
        modal_chatReact.react(type);
    }

    const outClick = (e) => {
        if(closeLock) return;
        const dialogContainer = e.currentTarget.querySelector('.dialog-container');
        if (!dialogContainer.contains(e.target)) {
            react(3);
        }
    }

</script>

{#if $modal_chatReact}
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
                <div><a class="fn" on:click|preventDefault={() => react(2)}>답변하기</a></div>
                <div><a class="fn" on:click|preventDefault={() => react(1)}>확인 요청하기</a></div>
            </div>
        </div>
    </div>
</dialog>
{/if}

<style>
</style>