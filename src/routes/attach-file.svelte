<!-- 채팅창 더보기 - 첨부파일 -->
<script>
	import { onMount, setContext } from "svelte";
	import AddHeader from "../components/add-header.svelte";
	import ChatAside from "../components/chat-aside.svelte";
	import { addService } from "../api";
	import moment from "moment";

    export let params = {};
    setContext('echo_id', params.echo_id);
    
    let asideOpen = false;
    const change_asideOpen = () => asideOpen = !asideOpen;

    let get_fileList_await = null;
    let file_obj = {};
    const init = async () => {
        addService.get_fileList({
            echo_id: params.echo_id,
        }).then((data) => {
            console.log(data);
            data.file_list.map((v) => {
                let cur_date = moment(v.createdAt).format('YYYY-MM-DD');
                console.log(cur_date);
                if(!file_obj[cur_date]) file_obj[cur_date] = [v];
                else file_obj[cur_date].push(v);
            });
            file_obj = file_obj;
            console.log(Object.entries(file_obj));
        });
    }
    // 파일 확장자 확인인
    const check_extension = (name) => {
        const dot_split = name.split('.');
        const extension = dot_split[dot_split.length - 1].toLowerCase();;
        if(["xls", "xlsx"].includes(extension)) {
            return 'excel';
        } else if(["ppt","pptx", "potx", "pps"].includes(extension)) {
            return "ppt";
        } else if(["doc", "docx"].includes(extension)) {
            return "word"
        } else {
           return '???'; 
        }
    }
    onMount(() => {
        init();
    });
</script>

<div id="attachFile">
    <AddHeader title={"첨부 파일"} {change_asideOpen}/>

    <div class="main-content">
        <div class="container">
            <div class="files">
                {#each Object.entries(file_obj) as [group_date, files]}
                <div class="files-group">
                    <div class="date">{group_date}</div>
                    <div class="list">
                        {#each files as file, index}
                        <a href={file.file_url} download class="file-detail">
                            <div class="infor">
                                <div class="file-name">{file.file_name}</div>
                                <div class="file-send">보낸사람 | {file.sender}</div>
                            </div>
                            {#if check_extension(file.file_name) == "excel"}
                            <div class="file-type"><i class="icon-excel"></i></div>
                            {:else if check_extension(file.file_name) == "ppt"}
                            <div class="file-type"><i class="icon-ppt"></i></div>
                            {:else if check_extension(file.file_name) == "word"}
                            <div class="file-type"><i class="icon-word"></i></div>
                            {:else}
                            <div class="file-type">노확장자자</div>
                            {/if}
                        </a>
                        {/each}
                    </div>
                </div>
                {/each}
            </div>
            <!-- 
            <div class="files">
                <div class="files-group">
                    <div class="date">2024.11.13</div>
                    <div class="list">
                        <div class="file-detail">
                            <div class="infor">
                                <div class="file-name">차수별 조배조배치조배치조배치조배치조배치조배치조배치조배치조배치치.xlsx</div>
                                <div class="file-send">보낸사람 | 김지현/프로</div>
                            </div>
                            <div class="file-type"><i class="icon-excel"></i></div>
                        </div>
                        <div class="file-detail">
                            <div class="infor">
                                <div class="file-name">차수별 조배조배치조배치조배치조배치조배치조배치조배치조배치조배치치.xlsx</div>
                                <div class="file-send">보낸사람 | 김지현/프로</div>
                            </div>
                            <div class="file-type"><i class="icon-ppt"></i></div>
                        </div>
                    </div>
                </div>
                <div class="files-group">
                    <div class="date">2024.11.13</div>
                    <div class="list">
                        <div class="file-detail">
                            <div class="infor">
                                <div class="file-name">차수별 조배조배치조배치조배치조배치조배치조배치조배치조배치조배치치.xlsx</div>
                                <div class="file-send">보낸사람 | 김지현/프로</div>
                            </div>
                            <div class="file-type"><i class="icon-excel"></i></div>
                        </div>
                        <div class="file-detail">
                            <div class="infor">
                                <div class="file-name">차수별 조배조배치조배치조배치조배치조배치조배치조배치조배치조배치치.xlsx</div>
                                <div class="file-send">보낸사람 | 김지현/프로</div>
                            </div>
                            <div class="file-type"><i class="icon-word"></i></div>
                        </div>
                    </div>
                </div>
            </div>
             -->
        </div>
    </div>

    <ChatAside {asideOpen} on:change_asideOpen={change_asideOpen} echo_id={params.echo_id}
        echostep=0 />
</div>

<style>
#attachFile .main-content {
    padding-bottom:40px;
}
</style>