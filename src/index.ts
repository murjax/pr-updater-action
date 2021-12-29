import * as core from '@actions/core'
import * as github from '@actions/github'

const token = core.getInput('token')
const octokit = github.getOctokit(token)

async function main() {
    const baseBranch = github.context.payload.ref
    const pullsResponse = await octokit.rest.pulls.list({
        ...github.context.repo,
        base: baseBranch,
        state: 'open',
    })
    const prs = pullsResponse.data
    await Promise.all(
        prs.map((pr) => {
            octokit.rest.pulls.updateBranch({
                ...github.context.repo,
                pull_number: pr.number,
            })
        }),
    )
}

main()
