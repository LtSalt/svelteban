<script>
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