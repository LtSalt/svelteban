<script>
    export let fs;
    export let gap;
    export let length;
    export let margin;
    export let innerSpacing;

</script>

<div id="logo" style="margin: {margin}">
    <div id="icon" style="gap: {gap}">
        <div style="gap: {gap}">
            <div style="width: {length}; height: {length}"></div>
            <div style="width: {length}; height: {length}"></div>
            <div style="width: {length}; height: {length}"></div>
        </div>
        <div style="gap: {gap}">
            <div style="width: {length}; height: {length}"></div>
            <div style="width: {length}; height: {length}"></div>
            <div style="width: {length}; height: {length}"></div>
        </div>
        <div style="gap: {gap}">
            <div style="width: {length}; height: {length}"></div>
            <div style="width: {length}; height: {length}"></div>
            <div style="width: {length}; height: {length}"></div>
        </div>
    </div>
    <h1 style="font-size: {fs}; margin-left: {innerSpacing}">Svelteban</h1>
</div>

<style lang="scss">
    #logo {
        display: flex;
        align-items: center;

        #icon {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        
        > * {
            display: grid;

            &:nth-child(1) > * {
                    background-color: var(--bg-accent-1);
                }

            &:nth-child(2) > * {
                    background-color: var(--bg-accent-2);
                }

            &:nth-child(3) > * {
                    background-color: var(--bg-accent-3);
                }
            }
        }
    }
</style>

