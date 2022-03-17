# Development

This integration uses Veracode's
[findings api](https://docs.veracode.com/r/c_findings_v2_intro)

## Provider account setup

See the
[In Veracode](https://github.com/JupiterOne/graph-veracode-v2/blob/main/docs/jupiterone.md#in-veracode)
section of the official integration docs for instructions on generating api keys
in a least-privledged manner. As functionality of this project evolves, please
verify the new set least-privledged access the Veracode
[Api service account](https://docs.veracode.com/r/c_about_veracode_accounts)
needs in order to operate correctly

## Authentication

Copy the `.env.example` to `.env` file and fill in the variables using the user
information and API token information generated from instructions above. The
mapping is as follows:

- VERACODE_API_ID=${`Veracode Api ID`}
- VERACODE_API_SECRET=${`Veracode Api Secret Key`}
