### Install the tbnctl command line interface (CLI)

tbnctl is a CLI for interacting with the Turbine Labs public API, and is used
throughout this guide to set up tbnproxy. Install tbnctl with these commands
(Requires [installation of Go](https://golang.org/dl/), and that `$GOPATH/bin`
is in your `$PATH`):

```console
$ go get -u github.com/turbinelabs/tbnctl
$ go install github.com/turbinelabs/tbnctl
$ tbnctl login
```

Use your Houston username and password to login.

```shell
Username [somebody@example.com]:
Password:
```

See the [tbnctl Guide](/guides/tbnctl.html) for more information.

### Get an API Access Token

Create an API Access Token using [tbnctl](/guides/tbnctl.html#access-tokens-add-comment):

```console
$ tbnctl access-tokens add "demo key"
```

```json
{
  "access_token_key": "<redacted>",
  "description": "demo key",
  "signed_token": "<redacted>",
  "user_key": "<redacted>",
  "created_at": "2017-08-25T22:11:30.907200482Z",
  "checksum": "d60ed8a6-1a40-49a5-5bb1-5bad322d9723"
}
```

You'll need the value of `signed_token` later on, so keep it somewhere secure.
