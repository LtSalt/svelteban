<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import AddItem from '$lib/components/AddItem.svelte';
	import { setContext } from 'svelte';
    import { Trash2Icon } from "svelte-feather-icons";

    export let data;
    setContext("data", data)

    $: userId = data.user?.userId;
    $: activeBoardId = data.userPreferences?.activeBoardId
    $: boards = data.userData?.boards

    let editing = false;

    async function setActiveBoard(userId: string, boardId: number) {
        const res = await fetch("/preferences/activeBoard", {
            method: "POST",
            body: JSON.stringify({ userId, boardId } ),
            headers: {
                "content-type": "preferences/json"
            }
        })
        invalidateAll()
    }
</script>

<div id="sidebar">
    <h3>Boards</h3>
    <nav>
        {#if boards && userId}
            <ul>
                {#each boards as board}
                    <li class:active={activeBoardId === board.id}>
                        <form class="edit" action="?/editBoard&boardId={board.id}" method="POST" use:enhance on:mouseup={setActiveBoard(userId, board.id)}>
                            <input type="text" value={board.title} name="boardTitle" readonly={editing === false}
                                on:dblclick={() => editing = true}
                                on:focusout={() => editing = false}>
                        </form>
                        <form class="delete" action="?/removeBoard&userId={userId}" method="POST" use:enhance>
                            <input type="text" name="boardId" value={board.id} hidden>
                            <button type="submit">
                                <Trash2Icon size=16></Trash2Icon>
                            </button>
                        </form>
                    </li>
                {/each}
            </ul>
        {/if}
        {#if userId}
            <AddItem styles="margin-left: 16px;     " action="?/createBoard&userId={userId}"></AddItem>
        {/if}
    </nav>
</div>


<style lang="scss">

    h3 {
        margin: 8px 12px
    }

    .active {
        background-color: var(--bg-accent-1);
        color: var(--clr-on-accent);
    }
    #sidebar {
        background-color: var(--bg-surface);
        width: 14rem;
    }

    li {
        // padding-inline: 12px 12px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        transition: background-color 0s;

        input {
            cursor: pointer;
            padding-left: 12px
        }

        .delete {
            display: flex;
            align-items: center;

            button {
                padding-inline: 12px;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;

                &:focus {
                    outline: thick double var(--clr-primary);
                }

            }
            // width: 20px;
        }

        .edit {
            flex: 1;

            > input {
                width: 100%;
                height: 100%;
                margin-left: 4px;
                border-radius: 0;

                &:focus {
                    outline: thick double var(--clr-primary);
                }
            }
        }
    }
</style>
    

