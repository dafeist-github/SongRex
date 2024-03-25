<script>
    export let state;
</script>

  {#if state === 'success'}
    <p class={state}>&#9989; Vorschlag erfolgreich abgegeben</p>
  {/if}

  {#if state === 'missing_name'}
    <p class={state}>&#10060; Bitte gebe einen Namen an</p>
  {/if}

  {#if state === 'invalid_link'}
  <p class={state}>&#10060; Bitte gebe einen gültigen Link an</p>
  {/if}

  {#if state === 'server_error'}
  <p class={state}>&#10060; Interner Server-Error :/</p>
  {/if}

<style>

  p {
    font-family: Arial;
    font-weight: bold;
    font-size: 1.4vw;
    text-align: center;
    color: rgb(0, 255, 0);
    margin-top: 2vw;
    border-style: solid;
    border-radius: 10px;
    width: 30vw;
    margin-left: 34.6vw;
    height: 3vw;
    line-height: 3vw;
  }

  .missing_name, .invalid_link {
    color: rgb(236, 36, 36);
  }

  @media screen and (max-width: 800px) {

  p {
    font-size: 6vw;
    padding: 0;
    line-height: 12vw;
    width: 90vw;
    height: 24vw;;
    margin-top: 26px;
    margin-left: 2vw;
    }

  .missing_name {
    height: 12vw;
  }

  }

</style>