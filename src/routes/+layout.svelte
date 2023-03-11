<script>
    import "@fontsource/poppins"
    import "../styles.css"

    export let data;
</script>

<header>
    <nav>
        <ul>
            <li>
                <h1><a href="/">SvelteBan</a></h1>
            </li>
        </ul>
        <ul>
        {#if !data.user}
            <li><a href="/register">Register</a></li>
            <li><a href="/login">Login</a></li>
        {:else}
        <li><a href="/boards">Boards</a></li>
            <li>
                <form action="/logout" method="POST">
                    <button type="submit">Logout</button>
                </form>
        {/if}
        </ul>
    </nav>
</header>


<slot></slot>

<style lang="scss">
    header nav {
        padding-inline: var(--pd-page-inline);
        padding-block: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--bg-surface);
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);

        ul {
            display: flex;
            gap: 1em;
        }
    }
</style>