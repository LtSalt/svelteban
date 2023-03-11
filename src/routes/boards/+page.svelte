<script lang="ts">
	import { enhance } from '$app/forms';
	import { setContext } from 'svelte';

    export let data;
    setContext("data", data)

    $: userId = data.user?.userId;
    $: boards = data.userData?.boards
    $: activeBoardId = data.userPreferences?.activeBoardId

    let editing = false;

    async function setActiveBoard(userId: string, boardId: number) {
        const res = await fetch("/preferences/activeBoard", {
            method: "POST",
            body: JSON.stringify({ userId, boardId } ),
            headers: {
                "content-type": "preferences/json"
            }
        })
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
                                on:dblclick={() => editing = true}>
                        </form>
                        <form class="delete" action="" method="POST" use:enhance>
                            <input type="text" value={board.title} hidden>
                            <button type="submit">X</button>
                        </form>
                    </li>
                {/each}
            </ul>
        {/if}
    </nav>
</div>

<style lang="scss">

    .active {
        background-color: var(--bg-accent-1);
        color: var(--clr-on-accent);
    }
    #sidebar {
        background-color: var(--bg-surface);
        width: 12rem;
        // box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
        // z-index: -99;
    }

    li {
        // padding-inline: 12px;
        display: flex;
        justify-content: space-between;

        .delete {

            button {
                padding-inline: 12px;

            }
            // width: 20px;
        }

        .edit {
            flex: 1;

            > input {
                width: 100%;
            }
        }
    }
</style>
    

