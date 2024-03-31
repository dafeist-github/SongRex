<script>

  let showFeedback = false;
  let submitState;

  let name = "";
  let link = "";

  import SubmitFeedback from '$lib/SubmitFeedback.svelte';

  const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const regex = new RegExp(expression);

  async function submitRequest() {
    console.log("attempting song submit");

    if(name.length <= 5) {
      submitState = 'missing_name';
      
    } else if(link.length <= 20 || !link.match(regex)) {
      submitState = 'invalid_link';

    } else {
      const res = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "name": name,
          "link": link
        })
      });

      if(res.ok) {
        submitState = 'success';

        name = "";
        link = "";
      } else {
        submitState = 'server_error';
      }
    }

    showFeedback = true;
  
}

async function handleEnter(event) {
  if(event.key === "Enter") submitRequest();
}

</script>

<main>

<a href="/login" class="dj-nav">Verwaltung</a>

<p class="info">Song-Vorschlag einreichen</p>

<div class="form">

<div class="desc">
  <p class="songname-desc">Name:</p>
  <input class="songname-field" type="text" bind:value={name} placeholder="Rick Astley - Never Gonna Give You Up" maxlength="60" on:keydown={handleEnter}>
</div>

<div class="desc">
  <p class="songlink-desc">Link:</p>
  <input class="songlink-field" type="text" bind:value={link} placeholder="https://soundcloud.com/rick-astley-official/never-gonna-give-you-up-4" maxlength="120" on:keydown={handleEnter}>
</div>

<button class="submit" on:click={submitRequest}>Absenden</button>

{#if showFeedback}
  <SubmitFeedback state={submitState}/>
{/if}

</div>

</main>

<style>

  .dj-nav {
    font-size: 1.8vw;
    width: 26vw;
    margin-left: 68vw;
    font-family: Arial;
    color: white;
    border-radius: 10px;
    background-color: rgb(57, 117, 233);
    padding-left: 4vw;
    padding-right: 4vw;
    padding-bottom: 1vw;
    padding-top: 1vw;
    text-decoration: none;
    }

  .dj-nav:hover {
    background-color: rgb(31, 89, 204);
  }

  .info {
    font-size: 2.6vw;
    font-family: Arial;
    color: rgb(142, 238, 255);
    text-align: center;
    margin-top: 100px;
    margin-bottom: 0px;
  }

  .desc {
    display: flex;
    align-items: center;
    margin-left: 38.6vw;
    height: 64px;
  }

  .form {
    margin-top: 12px;
    display: inline-block;
    width: 100%;
  }

  .songname-desc, .songlink-desc {
    width: 50px;
    font-family: Arial;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: rgb(142, 238, 255);
    padding: 10px;
  }

  .songname-field, .songlink-field {
    margin-left: 1%;
    height: 38px;
    width: 28.6%;
    font-size: 20px;
    font-family: Arial;
    color: rgb(142, 238, 255);
    background-color: rgb(31, 32, 34);
    border-radius: 10px;
    border-width: 2px;
    border-style: solid;
    border-color: rgb(57, 117, 233);
  }

  .submit {
    margin-left: 39.8vw;
    margin-top: 0.6vw;
    width: 20vw;
    height: 2.6vw;
    font-family: Arial;
    font-size: 1.8vw;
    text-align: center;
    padding: 0px;
    line-height: 0px;
    color: white;
    border-width: 0px;
    border-radius: 10px;
    background-color: rgb(57, 117, 233);
    cursor: pointer;
  }

  .submit:hover {
    background-color: rgb(31, 89, 204);
  }

  @media screen and (max-width: 800px) {
    .info {
      font-size: 7.2vw;
    }

    .desc {
      margin-left: 6vw;
    }

    .dj-nav {
      font-size: 5vw;
      margin-left: 64.2vw;
    }

    .songname-field, .songlink-field {
      margin-left: 3vw;
      width: 60vw;
    }

    .submit {
      margin-top: 3vw;
      margin-left: 17vw;
      width: 60.5vw;
      height: 14vw;
      font-size: 7vw;
      transition: 0s 0.12s;
    }

    .submit:active {
      background-color: rgb(31, 89, 204);
      transition: 0s;
    }

  }

</style>