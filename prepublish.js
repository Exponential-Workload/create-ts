const fs = require('fs')
const dotfiles = ['gitignore', 'npmignore', 'requires-pnpm', 'postcreate'].map(v => `.${v}`)
const runDir = (dir) => (dir.includes('/.pnpm') || dir.includes('node_modules')) ? [] : fs.readdirSync(dir).map(v => [`${dir}/${v}`, v, dir, fs.statSync(`${dir}/${v}`)]).forEach(([filePath, file, dir, stat]) => {
  if (stat.isDirectory()) runDir(filePath)
  else if (dotfiles.includes(file)) {
    console.log('[prepublish]: Make copy of', filePath);
    if (file === '.npmignore')
      fs.copyFileSync(filePath, `${dir}/${file.replace('.', '')}`)
    else
      fs.copyFileSync(filePath, `${dir}/dotfile${file}`)
  }
})
runDir('templateFiles')
