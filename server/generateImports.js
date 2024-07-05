import { fileURLToPath } from "node:url"
import fs from "fs"
import path from "path"

const special = {
  'daily_signin.js': '/daily_signin',
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm'
}

const servicesPath = fileURLToPath(new URL("./module/", import.meta.url))
const outputFilePath =
  fileURLToPath(new URL("./module/", import.meta.url)) + "index.js"

fs.readdir(servicesPath, (err, files) => {
  if (err) {
    console.error("Error reading services folder:", err)
    return
  }

  let imports = ""
  let exports = "export default {\n"

  files.forEach((file) => {
    if (path.extname(file) === ".js") {
      let route = (file in special) ? special[file] : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/')
      const name = path.basename(file, ".js")
      imports += `import ${name} from './${file}';\n`
      exports += `  '${route}': ${name},\n`
    }
  })

  exports += "};\n"

  const content = `${imports}\n${exports}`

  fs.writeFileSync(outputFilePath, content)

  console.log("Services index file generated:", outputFilePath)
})
