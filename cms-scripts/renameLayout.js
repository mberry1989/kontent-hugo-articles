const fs = require("fs")

//rename root layout folder to use theme's '_default' layout
const currPath = "./layouts/_default"
const newPath = "./layouts/default"

fs.rename(currPath, newPath, function(err) {
  if (err) {
    console.log(err)
  } else {
    console.log(`Successfully renamed the directory from ${currPath} to ${newPath} to override layouts with a theme.`)
  }
})