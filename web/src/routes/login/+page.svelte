<script>
  import SubmitFeedback from '$lib/SubmitFeedback.svelte';
  import { goto } from '$app/navigation';

  let username = "";
  let password = "";

  const hosturl = (import.meta.env.VITE_SERVER_HOST || "server") + ":3000";

  let showFeedback = false;
  let submitState = "";

  if(localStorage.getItem("token")) goto("/manage");

  async function handleEnter(event) {
      if (event.key === 'Enter') {
          submitLogin();
      }
  }

  async function submitLogin() {
    console.log("attempting login");

    if(username.length < 4 || password.length < 8) {
      submitState = "invalid_creds";
      showFeedback = true;

      return;
    }

    const res = await fetch(hosturl + '/auth', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "username": username,
          "password": password
        })
      });

      if(res.ok) {

        const json = await res.json();
        await localStorage.setItem('token', json.token);
        await localStorage.setItem('username', username);

        goto("/manage");

      } else {
        console.log("not ok :(")

        submitState = "invalid_creds";
        showFeedback = true;
      }
    }

</script>

<main>

<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">

<a href="/" class="back">Zurück</a>

<p class="info">Bitte melde dich an</p>

<div class="form">

<div class="desc">
<i class="fas fa-user"></i>
<input class="username-field" type="text" bind:value={username} placeholder="Benutzername" maxlength="60" on:keydown={handleEnter}>
</div>

<div class="desc">
<i class="fas fa-lock"></i>
<input class="password-field" type="password" bind:value={password} placeholder="Passwort" maxlength="120" on:keydown={handleEnter}>
</div>

</div>

<button class="submit" on:click={submitLogin}>Anmelden</button>

{#if showFeedback}
  <SubmitFeedback state={submitState}/>
{/if}

</main>

<style>

  i {
    color: white;
    font-size: 1.6vw;
    margin-left: 1.32vw;
  }

  .info {
    font-size: 2.6vw;
    font-family: Arial;
    color: rgb(142, 238, 255);
    text-align: center;
    margin-top: 100px;
    margin-bottom: 0px;
  }

  .back {
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

  .username-field, .password-field {
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

  .back:hover {
    background-color: rgb(31, 89, 204);
  }

  @media screen and (max-width: 800px) {

    i {
      margin-left: 4vw;
      font-size: 8vw;
    }

    .form {
      margin-top: 4px;
    }

    .back {
      font-size: 5vw;
      margin-left: 64.2vw;
    }

    .username-field, .password-field {
      margin-left: 4vw;
      width: 62vw;
    }

    .info {
      font-size: 10vw;
    }

    .desc {
      margin-left: 6vw;
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