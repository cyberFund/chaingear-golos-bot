const _ = require('lodash')

const filesCommitsList = [ [ { sha: 'd5b4d87aeae3039bf9956e87513886cc0c3b1e5a',
      filename: 'sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml',
      status: 'added',
      additions: 2,
      deletions: 0,
      changes: 2,
      blob_url: 'https://github.com/ninjascant/chaingear/blob/315ca9c6224a0efcd1bf836e177c2feeb4587962/sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml',
      raw_url: 'https://github.com/ninjascant/chaingear/raw/315ca9c6224a0efcd1bf836e177c2feeb4587962/sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml',
      contents_url: 'https://api.github.com/repos/ninjascant/chaingear/contents/sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml?ref=315ca9c6224a0efcd1bf836e177c2feeb4587962',
      patch: '@@ -0,0 +1,2 @@\n+[blockchain]\n+project_name = "fld;fl;dlf;dlf;dl;www"\n\\ No newline at end of file' } ],
  [ { sha: '45ac65dcd4f5a1bc9c42daa8963c6503670e2ebc',
      filename: 'sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml',
      status: 'modified',
      additions: 2,
      deletions: 1,
      changes: 3,
      blob_url: 'https://github.com/ninjascant/chaingear/blob/4f3cdae7a9ed499b951f8582e5bd9ef2c79b0c96/sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml',
      raw_url: 'https://github.com/ninjascant/chaingear/raw/4f3cdae7a9ed499b951f8582e5bd9ef2c79b0c96/sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml',
      contents_url: 'https://api.github.com/repos/ninjascant/chaingear/contents/sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml?ref=4f3cdae7a9ed499b951f8582e5bd9ef2c79b0c96',
      patch: '@@ -1,2 +1,3 @@\n [blockchain]\n-project_name = "fld;fl;dlf;dlf;dl;www"\n\\ No newline at end of file\n+project_name = "fld;fl;dlf;dlf;dl;www"\n+' } ],
  [ { sha: '45ac65dcd4f5a1bc9c42daa8963c6503670e2ebc',
      filename: 'sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml',
      status: 'added',
      additions: 3,
      deletions: 0,
      changes: 3,
      blob_url: 'https://github.com/ninjascant/chaingear/blob/30ec81659f7b3bd0296ceb623f46e794884ec3c2/sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml',
      raw_url: 'https://github.com/ninjascant/chaingear/raw/30ec81659f7b3bd0296ceb623f46e794884ec3c2/sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml',
      contents_url: 'https://api.github.com/repos/ninjascant/chaingear/contents/sources/fldfldlfdlfdlwww/fldfldlfdlfdlwww.toml?ref=30ec81659f7b3bd0296ceb623f46e794884ec3c2',
      patch: '@@ -0,0 +1,3 @@\n+[blockchain]\n+project_name = "fld;fl;dlf;dlf;dl;www"\n+' } ] ]
console.log('New attempt')
const groupedByFile = filesCommitsList.map(fileArr => fileArr[0]).reduce((grouped, item) => {
  //console.log(item.filename)
  grouped[item.filename] = grouped[item.filename] || [] 
  grouped[item.filename].push(item)
  return grouped
}, {})
const lastChanges = Object.keys(groupedByFile).reduce((acc, key) => {
  acc.push(groupedByFile[key])
  return acc
}, []).map(fileChangesArr => fileChangesArr[fileChangesArr.length-1])
console.log(lastChanges)